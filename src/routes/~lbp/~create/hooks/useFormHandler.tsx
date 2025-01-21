import { useEffect } from 'react';

import { Atom, useAtom, useAtomValue, WritableAtom } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import { DefaultValues, FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import { useGetFocusAtom, useGetMetadataFocusAtom } from '../atom';
import { FormState } from '../types';

/**
 * Props for the useFormHandler hook.
 *
 * @template FormInputType - The type of the form input values.
 * @template ActionType - The type of the action used for updating the form details atom.
 */
interface FormHandlerHookProps<FormInputType extends FieldValues, ActionType> {
  formDataAtom: Atom<FormInputType>;
  /**
   * The key of the form item in the form state.
   */
  formItemKey: keyof FormState;

  /**
   * The id of entry in atom
   */
  id: string;

  /**
   * IOC Function to perform any sort of actions once form is submitted.
   *
   */
  onSubmitAction?: () => void;
  /**
   * The writable atom for updating the form details.
   */
  updateFormDetailsAtom: WritableAtom<null, [action: ActionType], void>;
}

/**
 * Custom hook to handle form state and submission logic. This hook is valid only for create and mint pool logic
 * as it shares common logic
 *
 * @template FormInputType - The type of the form input values.
 * @template ActionType - The type of the action used for updating the form details atom.
 *
 * @param {FormHandlerHookProps<FormInputType, ActionType>} props - The properties for the useFormHandler hook.
 * @returns An object containing form control methods and state.
 */
const useFormHandler = <FormInputType extends FieldValues, ActionType>({
  id,
  formDataAtom,
  formItemKey,
  onSubmitAction,
  updateFormDetailsAtom,
}: FormHandlerHookProps<FormInputType, ActionType>) => {
  const { writeOnlyFocusedAtom: updateFormStateAtom } = useGetFocusAtom('formState', id);
  const metadatAtom = useGetMetadataFocusAtom(id);
  const [, updateMetaDataAtom] = useAtom(metadatAtom);
  const formData = useAtomValue(formDataAtom);

  const [, updateFormAtom] = useAtom(updateFormDetailsAtom);
  const [, setFormState] = useAtom(updateFormStateAtom);

  const methods = useForm<FormInputType>({
    defaultValues: formData as DefaultValues<FormInputType>,
    // mode: 'onBlur',
    // reValidateMode: 'onSubmit',
    values: formData,
  });

  const {
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = methods;

  useEffect(() => {
    if (!isEmpty(errors) && !isValid) {
      setFormState({ key: formItemKey, value: false });
    }
  }, [isValid, errors, setFormState, formItemKey]);

  const onUpdateAtom = <K extends keyof FormInputType>(key: K, value: FormInputType[K]) => {
    if (formItemKey !== 'launchInfo') updateMetaDataAtom('');
    if (key === 'tokenTicker' && value) {
      value = value.toUpperCase();
    }
    updateFormAtom({ key, value } as ActionType);
  };

  const onSubmit: SubmitHandler<FormInputType> = () => {
    setFormState({ key: formItemKey, value: true });
    if (isFunction(onSubmitAction)) onSubmitAction();
  };

  return {
    handleSubmit: handleSubmit(onSubmit),
    methods,
    onUpdateAtom,
    setValue,
    updateFormAtom,
  };
};

export default useFormHandler;
