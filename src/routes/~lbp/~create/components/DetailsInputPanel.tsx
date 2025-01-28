import type { ReactDatePickerCustomHeaderProps } from 'react-datepicker/dist/calendar';

import { useEffect } from 'react';

import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useMultiStyleConfig,
  VStack,
} from '@chakra-ui/react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import find from 'lodash/find';
import isNaN from 'lodash/isNaN';
import DatePicker from 'react-datepicker';
import { Controller, FormProvider } from 'react-hook-form';
import { FaQuestionCircle } from 'react-icons/fa';
import { RxArrowLeft, RxArrowRight } from 'react-icons/rx';

import { FilePreviewType } from '@app-types/index';

import FileUpload from '@components/FileUpload';
import QuillEditor from '@components/TextEditor';
import { FormHandler, FormInput } from '@components/ui/Form';
import { TooltipWithIcon } from '@components/ui/Tooltip';
import { APPRX_COST_TO_DEPLOY, FileUploadStatus, TabMoveAction, ToastType } from '@constants/index';
import {
  STRING_GITHUB_USERNAME,
  STRING_TWITTER_USERNAME,
  STRING_URL_PATTERN,
} from '@constants/stringPattern';
import { TOKEN_NAME_VALIDATION_RULES, TOKEN_SYMBOL_VALIDATION_RULES } from '@constants/validations';
import useLBPSettings from '@hooks/lbp/useLBPSettings';
import useWebIrys from '@hooks/useIrys';
import { useProgressiveToast } from '@hooks/useProgressiveToast';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';
import { Weights } from '@utils/weights';

import { CheckIcon, SolLogo } from '@assets/icons';
import { CoconutTree } from '@assets/imges';

import {
  defaulPoolData,
  tabIndexAtom,
  tokenAndPoolInfoAtom,
  useDuplicateNewAtom,
  useGetFocusAtom,
  useGetMetadataFocusAtom,
} from '../atom';
import useFormHandler from '../hooks/useFormHandler';
import {
  FormState,
  LaunchInfoInput,
  ProjectDetailsInput,
  SocialsInput,
  TokenFormInput,
  UpdateLauncDataPayload,
  UpdateProjectPayload,
  UpdateSocialsPayload,
  UpdateTokenPayload,
} from '../types';
import FormFooter from './FormFooter';

import 'react-datepicker/dist/react-datepicker.css';

interface LaunchInfoFormProps {
  collateralAmount: Decimal | null;
  isPending: boolean;
  onCreatePool: () => void;
}
interface FormBasicProps {
  changeTab: (index?: number, forceMoveTo?: TabMoveAction) => void;
  id: string;
}
const TabListItems: { id: keyof FormState; label: string; tabIndex: number }[] = [
  {
    id: 'tokenInfo',
    label: 'Token Info',
    tabIndex: 0,
  },
  { id: 'projectInfo', label: 'Project info', tabIndex: 1 },
  { id: 'socialsInfo', label: 'Socials', tabIndex: 2 },
  { id: 'launchInfo', label: 'Launch info', tabIndex: 3 },
];

const TokenInfoForm = ({ id, changeTab }: FormBasicProps) => {
  const { getFilePreview, setUploadStatus, uploadFile, uploadStatus } = useWebIrys();

  const { data: lbpSettings } = useLBPSettings();
  const { showToast } = useProgressiveToast({}, { variant: 'secondary' });

  const isFileUploading = !(
    uploadStatus === FileUploadStatus.UPLOAD_ERROR ||
    uploadStatus === FileUploadStatus.UPLOAD_SUCCESS ||
    uploadStatus === FileUploadStatus.UPLOAD_IDLE
  );
  const setTokenAndPoolData = useSetAtom(tokenAndPoolInfoAtom);
  const duplicateNewAtom = useDuplicateNewAtom();
  const navigate = useNavigate();

  const {
    focusedAtom: tokenFocusedAtom,
    readonlyFocusedAtom: tokenAtomReadOnly,
    writeOnlyFocusedAtom: updateTokenAtom,
  } = useGetFocusAtom('tokenInfo', id);

  const [tokenDetails, setTokenAtom] = useAtom(tokenFocusedAtom);

  // TODO: check on this atom creation
  const [, updateMetaDataAtom] = useAtom(useGetMetadataFocusAtom(id));

  const onUploadFile = async () => {
    const file = tokenDetails.tokenLogo;
    if (!file || !(file instanceof File) || tokenDetails.tokenLogoFilePreview?.isUploaded) return;
    setTokenAtom((currentTokenValue) => ({
      ...currentTokenValue,
      fileArweaveId: '',
      // tokenLogo: null,
      // tokenLogoFilePreview: null,
    }));
    const receipt = await uploadFile(file, [
      { name: 'file-name', value: file.name },
      { name: 'file-type', value: file.type },
      { name: 'file-size', value: file.size.toString() },
    ]);
    if (!receipt) {
      // setError('tokenLogo', {
      //   message: 'Failed to upload file. Please try again!',
      //   type: 'manual',
      // });
      setTokenAtom((currentTokenValue) => ({
        ...currentTokenValue,
        fileArweaveId: '',
        // tokenLogo: null,
        // tokenLogoFilePreview: null,
      }));
      // return;
      showToast({ title: 'Token logo upload failed. Please try again.', type: ToastType.FAILED });
      throw new Error('file upload failed');
    }
    const filePreview = await getFilePreview(receipt.id);

    setTokenAtom((currentTokenValue) => ({
      ...currentTokenValue,
      fileArweaveId: receipt.id,
      tokenLogo: file,
      tokenLogoFilePreview: filePreview || null,
    }));

    updateMetaDataAtom('');
    // if the draft id = 'new' then move the data to new id
    if (id.toLowerCase() === 'new') {
      const draftId = duplicateNewAtom();
      navigate({
        search: {
          draft: draftId,
        },
        to: '/lbp/create',
      });
    }
  };

  const { handleSubmit, methods, onUpdateAtom, setValue } = useFormHandler<
    TokenFormInput,
    UpdateTokenPayload
  >({
    id,
    formDataAtom: tokenAtomReadOnly,
    formItemKey: 'tokenInfo',
    onSubmitAction: async () => {
      await onUploadFile();
      changeTab(undefined, TabMoveAction.NEXT);
    },
    updateFormDetailsAtom: updateTokenAtom,
  });

  const {
    clearErrors,
    control,
    formState: { errors },
    // setError,
  } = methods;

  const onDeleteFile = () => {
    setUploadStatus(FileUploadStatus.UPLOAD_IDLE);
    setValue('tokenLogo', null);
    updateMetaDataAtom('');
    setTokenAtom((currentTokenValue) => ({
      ...currentTokenValue,
      fileArweaveId: '',
      tokenLogo: null,
      tokenLogoFilePreview: null,
    }));
  };

  const onChangeFile = (file: File) => {
    const filePreview: FilePreviewType = {
      isUploaded: false,
      name: file.name,
      preview: URL.createObjectURL(file),
      size: file.size,
      type: file.type,
    };

    setTokenAtom((currentTokenValue) => ({
      ...currentTokenValue,
      tokenLogo: file,
      tokenLogoFilePreview: filePreview,
    }));
  };

  const onCancelCreation = () => {
    navigate({
      search: {
        draft: 'new',
      },
      to: '/lbp/create',
    });
    setTokenAndPoolData((currentStateData) => {
      const newState = { ...currentStateData };
      newState.new = defaulPoolData;
      if (id !== 'new') {
        newState[id] = {
          ...newState[id],
          isDeleted: true,
        };
      }
      return newState;
    });
    clearErrors();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} style={{ height: '100%' }}>
        <Flex flexDirection="column" h="100%" justifyContent="space-between">
          <Flex flexDirection="column" gap={4}>
            <FormHandler
              inputField={
                <FormInput<TokenFormInput>
                  control={control}
                  maxLength={32}
                  name="tokenName"
                  onChange={onUpdateAtom}
                  placeholder="Name your token..."
                  rules={TOKEN_NAME_VALIDATION_RULES}
                />
              }
              fieldError={errors?.tokenName}
              htmlFor="token name"
              label="Token name"
              required
            />
            <FormHandler
              inputField={
                <FormInput<TokenFormInput>
                  control={control}
                  maxLength={10}
                  name="tokenTicker"
                  onChange={onUpdateAtom}
                  placeholder="eg: EXMPL"
                  rules={TOKEN_SYMBOL_VALIDATION_RULES}
                />
              }
              fieldError={errors?.tokenTicker}
              htmlFor="token ticker"
              label="Token ticker"
              required
            />
            <FormHandler
              inputField={
                <FormInput<TokenFormInput>
                  rules={{
                    min: 0,
                    required: 'Required field',
                    validate: (value) => {
                      const numberValue = Number(value);
                      // Ensure the value is not a floating point and within the allowed range
                      if (isNaN(numberValue) || !Number.isInteger(numberValue))
                        return 'Please enter a whole number';
                      return (numberValue <= 1_000_000_000 && numberValue >= 0) || 'Invalid entry';
                    },
                  }}
                  control={control}
                  name="tokenSupply"
                  onChange={onUpdateAtom}
                  placeholder="0.00"
                  type="number"
                />
              }
              fieldError={errors?.tokenSupply}
              helperText="Up to 1 billion tokens."
              htmlFor="token supply"
              label="Token supply"
              required
            />
            <FormHandler
              inputField={
                <Controller
                  render={({ field }) => (
                    <FileUpload
                      // onUpload={() => {
                      //   field.onChange(tokenDetails.tokenLogo);
                      //   onUploadFile();
                      onChange={(file) => {
                        field.onChange(file);
                        onChangeFile(file);
                      }}
                      // }}
                      fileUploadStatus={uploadStatus}
                      isInvalid={!!errors?.tokenLogo}
                      onDeleteFile={onDeleteFile}
                      // selectedFile={getValues('tokenLogo')}
                      selectedFile={tokenDetails.tokenLogoFilePreview}
                    />
                  )}
                  rules={{
                    required: 'Required field',
                    // validate: () => !!tokenDetails.tokenLogoFilePreview || 'File is not uploaded',
                  }}
                  control={control}
                  name="tokenLogo"
                />
              }
              fieldError={errors?.tokenLogo}
              htmlFor="file upload"
              label="Token logo"
              required
            />
          </Flex>
          <CardFooter px="0">
            <FormFooter
              cancelText="Cancel"
              isLoading={isFileUploading}
              onCancel={onCancelCreation}
              submitDisabled={lbpSettings?.isPaused}
              submitText={lbpSettings?.isPaused ? 'LBP is paused' : 'Mint token & Next'}
            />
          </CardFooter>
        </Flex>
      </form>
    </FormProvider>
  );
};

const SaleDetailsForm = ({ id, changeTab }: FormBasicProps) => {
  const { readonlyFocusedAtom: projectInfoReadAtom, writeOnlyFocusedAtom: updateProjectInfoAtom } =
    useGetFocusAtom('projectInfo', id);

  const { handleSubmit, methods, onUpdateAtom } = useFormHandler<
    ProjectDetailsInput,
    UpdateProjectPayload
  >({
    id,
    formDataAtom: projectInfoReadAtom,
    formItemKey: 'projectInfo',
    onSubmitAction: () => changeTab(undefined, TabMoveAction.NEXT),
    updateFormDetailsAtom: updateProjectInfoAtom,
  });

  const {
    control,
    formState: { errors },
  } = methods;

  return (
    <form onSubmit={handleSubmit} style={{ height: '100%' }}>
      <Flex flexDirection="column" h="100%" justifyContent="space-between">
        <Flex flexDirection="column" gap={4}>
          <FormHandler
            inputField={
              <Controller
                render={({ field: { onChange, value } }) => (
                  <QuillEditor
                    onChange={(htmlContent: string) => {
                      onChange(htmlContent);
                      onUpdateAtom('projectDescription', htmlContent);
                    }}
                    isInvalid={!!errors?.projectDescription}
                    value={value}
                  />
                )}
                rules={{
                  required: 'Required field',
                  // by default quill editor have this value
                  validate: (value) => value !== '<h2><br></h2>' || 'Required field',
                }}
                control={control}
                name="projectDescription"
              />
            }
            fieldError={errors?.projectDescription}
            htmlFor="Agent description"
            label="Agent description"
            required
          />
          <FormHandler
            inputField={
              <FormInput<ProjectDetailsInput>
                rules={{
                  pattern: STRING_URL_PATTERN,
                  required: 'Required field',
                }}
                control={control}
                name="website"
                onChange={onUpdateAtom}
                placeholder="Enter url..."
              />
            }
            fieldError={errors?.website}
            htmlFor="website"
            label="Website"
            required
          />
          <FormHandler
            inputField={
              <FormInput<ProjectDetailsInput>
                rules={{
                  pattern: STRING_URL_PATTERN,
                }}
                control={control}
                name="roadmap"
                onChange={onUpdateAtom}
                placeholder="Enter roadmap url..."
              />
            }
            fieldError={errors?.roadmap}
            htmlFor="roadmap"
            label="Roadmap"
            optional
          />
          <FormHandler
            inputField={
              <FormInput<ProjectDetailsInput>
                rules={{
                  pattern: STRING_URL_PATTERN,
                }}
                control={control}
                name="whitePaper"
                onChange={onUpdateAtom}
                placeholder="Enter whitepaper url..."
              />
            }
            fieldError={errors?.whitePaper}
            htmlFor="whitePaperLink"
            label="Whitepaper"
            optional
          />
        </Flex>
        <CardFooter px="0">
          <FormFooter
            cancelText="Back"
            onCancel={() => changeTab(undefined, TabMoveAction.PREV)}
            submitText="Next step"
          />
        </CardFooter>
      </Flex>
    </form>
  );
};

const SocialsForm = ({ id, changeTab }: FormBasicProps) => {
  const { readonlyFocusedAtom: socialsInfoReadAtom, writeOnlyFocusedAtom: updateSocialsAtom } =
    useGetFocusAtom('socialsInfo', id);

  const { handleSubmit, methods, onUpdateAtom } = useFormHandler<
    SocialsInput,
    UpdateSocialsPayload
  >({
    id,
    formDataAtom: socialsInfoReadAtom,
    formItemKey: 'socialsInfo',
    onSubmitAction: () => changeTab(undefined, TabMoveAction.NEXT),
    updateFormDetailsAtom: updateSocialsAtom,
  });

  const {
    control,
    formState: { errors },
  } = methods;

  return (
    <form onSubmit={handleSubmit} style={{ height: '100%' }}>
      <Flex flexDirection="column" h="100%" justifyContent="space-between">
        <Flex flexDirection="column" gap={4}>
          <FormHandler
            inputField={
              <FormInput<SocialsInput>
                rules={{
                  pattern: STRING_TWITTER_USERNAME,
                }}
                control={control}
                name="twitter"
                onChange={onUpdateAtom}
                placeholder="Enter Twitter Username"
              />
            }
            fieldError={errors?.twitter}
            htmlFor="twitter"
            label="Twitter"
            optional
          />
          <FormHandler
            inputField={
              <FormInput<SocialsInput>
                rules={{
                  pattern: STRING_GITHUB_USERNAME,
                }}
                control={control}
                name="github"
                onChange={onUpdateAtom}
                placeholder="Enter Github Username"
              />
            }
            fieldError={errors?.github}
            htmlFor="github"
            label="Github"
            optional
          />
          <FormHandler
            inputField={
              <FormInput<SocialsInput>
                rules={{
                  pattern: STRING_URL_PATTERN,
                }}
                control={control}
                name="telegram"
                onChange={onUpdateAtom}
                placeholder="Enter Telegram link..."
              />
            }
            fieldError={errors?.telegram}
            htmlFor="telegram"
            label="Telegram"
            optional
          />
          <FormHandler
            inputField={
              <FormInput<SocialsInput>
                rules={{
                  pattern: STRING_URL_PATTERN,
                }}
                control={control}
                name="discord"
                onChange={onUpdateAtom}
                placeholder="Enter Discord link..."
              />
            }
            fieldError={errors?.discord}
            htmlFor="discord"
            label="Discord"
            optional
          />
        </Flex>
        <CardFooter px="0">
          <FormFooter
            cancelText="Back"
            onCancel={() => changeTab(undefined, TabMoveAction.PREV)}
            submitText="Continue"
          />
        </CardFooter>
      </Flex>
    </form>
  );
};

const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  nextMonthButtonDisabled,
  prevMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps) => {
  const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <Flex alignItems="center" justifyContent="space-around" marginBottom="10px">
      <IconButton
        aria-label="left-month"
        disabled={prevMonthButtonDisabled}
        icon={<Icon as={RxArrowLeft} boxSize={7} />}
        onClick={decreaseMonth}
        variant="unstyled"
      />
      <Text textStyle="body-md">{monthYear}</Text>
      <IconButton
        aria-label="right-month"
        disabled={nextMonthButtonDisabled}
        icon={<Icon as={RxArrowRight} boxSize={7} />}
        onClick={increaseMonth}
        variant="unstyled"
      />
    </Flex>
  );
};

const LaunchInfoForm = ({
  id,
  changeTab,
  collateralAmount,
  isPending,
  onCreatePool,
}: FormBasicProps & LaunchInfoFormProps) => {
  const minDate = dayjs().toDate();
  const styles = useMultiStyleConfig('DatePicker');

  const { data: lbpSettings } = useLBPSettings();

  const { readonlyFocusedAtom: launchDetailsAtom, writeOnlyFocusedAtom: updateLaunchAtom } =
    useGetFocusAtom('launchInfo', id);
  const [launchData] = useAtom(launchDetailsAtom);

  const { readonlyFocusedAtom: tokenAtom } = useGetFocusAtom('tokenInfo', id);
  const { tokenLogoFilePreview, tokenSupply, tokenTicker } = useAtomValue(tokenAtom);

  const submitAction = () => {
    onCreatePool();
  };

  const { handleSubmit, methods, onUpdateAtom } = useFormHandler<
    LaunchInfoInput,
    UpdateLauncDataPayload
  >({
    id,
    formDataAtom: launchDetailsAtom,
    formItemKey: 'launchInfo',
    onSubmitAction: submitAction,
    updateFormDetailsAtom: updateLaunchAtom,
  });

  const isDateLessThanToday = (date: Date | null | number | string) => {
    const selectedDate = dayjs(date).unix();
    const now = dayjs().unix();
    return selectedDate >= now || 'Selected date should not be earlier than current time';
  };

  const {
    control,
    formState: { errors },
  } = methods;

  const costToDeploy =
    collateralAmount ?
      `~ ${formatNumber({
        input: collateralAmount.add(APPRX_COST_TO_DEPLOY).toString(),
        suffix: 'SOL',
        type: NumberFormatType.TxValuesFormatter,
      })}`
    : '-';

  return (
    <form onSubmit={handleSubmit} style={{ height: '100%' }}>
      <Flex flexDirection="column" h="100%" justifyContent="space-between">
        <Flex flexDirection="column" gap={4} px={{ base: 4, md: 8 }}>
          <FormHandler
            inputField={
              <FormInput<LaunchInfoInput>
                rules={{
                  required: 'Required field',
                  validate: (value) => {
                    const numberValue = Number(value);
                    // Ensure the value is not a floating point and within the allowed range
                    if (isNaN(numberValue) || !Number.isInteger(numberValue))
                      return 'Please enter a whole number';
                    return (
                      (numberValue <= Number(tokenSupply) && numberValue >= 0) || 'Invalid entry'
                    );
                  },
                }}
                control={control}
                name="tokenAmount"
                onChange={onUpdateAtom}
                placeholder="0.00"
                type="number"
              />
            }
            fieldError={errors?.tokenAmount}
            htmlFor="token for sale"
            label="Token for sale"
            required
          />
          <FormHandler
            inputField={
              <Controller
                render={({ field }) => (
                  <Box __css={styles}>
                    <DatePicker
                      onChange={(date) => {
                        field.onChange(date);
                        onUpdateAtom('date', date);
                      }}
                      customInput={<Input id="starttime" variant="filled" />}
                      dateFormat="dd/MM/yyyy, HH:mm"
                      minDate={minDate}
                      placeholderText="DD/MM/YYYY, HH:mm"
                      renderCustomHeader={(props) => <CustomHeader {...props} />}
                      selected={field.value}
                      timeCaption="Time"
                      timeFormat="HH:mm"
                      timeIntervals={30}
                      showTimeSelect
                    />
                  </Box>
                )}
                control={control}
                name="date"
                rules={{ required: 'Required field', validate: isDateLessThanToday }}
              />
            }
            fieldError={errors?.date}
            htmlFor="start time"
            label="Start time"
            required
          />
          <FormHandler
            inputField={
              <FormInput<LaunchInfoInput>
                inputRightElement={
                  <Button
                    borderRadius="6px"
                    leftIcon={<Image alt="sol logo" boxSize={4} src={SolLogo} />}
                    minW="max-content"
                    padding={1}
                    size="xs"
                    variant="ghost"
                  >
                    SOL
                  </Button>
                }
                rules={{
                  required: 'Required field',
                  validate: (value) =>
                    (!isNaN(Number(value)) && Number(value) > 0) || 'Invalid entry',
                }}
                control={control}
                name="spotPrice"
                onChange={onUpdateAtom}
                placeholder="0.00"
                type="number"
              />
            }
            fieldError={errors?.spotPrice}
            htmlFor="spotPrice"
            label="Start price"
            required
          />
          <FormHandler
            inputField={
              <Flex flexDirection={{ base: 'column-reverse', md: 'column' }} gap={2}>
                <Flex alignItems="center" justifyContent="space-between">
                  <Flex flexDirection={{ base: 'column', md: 'row' }} gap={2}>
                    <Button
                      leftIcon={
                        <Image
                          alt="sol logo"
                          borderRadius="full"
                          boxSize={6}
                          src={tokenLogoFilePreview?.preview}
                        />
                      }
                      borderRadius="6px"
                      minW="max-content"
                      padding={3}
                      size="sm"
                      variant="ghost"
                    >
                      {tokenTicker}
                    </Button>
                    <Button borderRadius="6px" minW="max-content" size="sm" variant="ghost">
                      {launchData.startWeight}%
                    </Button>
                  </Flex>
                  <Flex flexDirection={{ base: 'column', md: 'row' }} gap={2}>
                    <Button
                      leftIcon={
                        <Image alt="sol logo" borderRadius="full" boxSize={6} src={SolLogo} />
                      }
                      borderRadius="6px"
                      minW="max-content"
                      padding={3}
                      size="sm"
                      variant="ghost"
                    >
                      SOL
                    </Button>
                    <Button borderRadius="6px" minW="max-content" size="sm" variant="ghost">
                      {Weights.getOppositeWeight(launchData.startWeight)}%
                    </Button>
                  </Flex>
                </Flex>
                <Controller
                  render={({ field }) => (
                    <Slider
                      {...field}
                      onChange={(val) => {
                        let newValue;
                        if (val < 10) newValue = 10;
                        else if (val > 99) newValue = 99;
                        else newValue = val;
                        field.onChange(newValue);
                        onUpdateAtom('startWeight', newValue);
                      }}
                      max={100}
                      min={0}
                      step={1}
                      value={field.value || 0}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  )}
                  rules={{
                    required: 'Required field',
                    validate: (value) =>
                      (typeof value === 'number' && value > 0) || 'Invalid entry',
                  }}
                  control={control}
                  name="startWeight"
                />
              </Flex>
            }
            fieldError={errors?.startWeight}
            htmlFor="startweight"
            label="Start weight"
            required
          />
        </Flex>
        <CardFooter px="0">
          <Flex flexDirection="column" gap={8} justifyContent="space-between" w="100%">
            <Box backgroundColor="surface.base.200">
              <VStack>
                <Divider h="2px" orientation="horizontal" />
                <Flex justifyContent="space-between" px={6} w="100%">
                  <HStack>
                    <Text>Cost to deploy</Text>
                    <TooltipWithIcon
                      tooltipContent={
                        collateralAmount ?
                          <Flex direction="column" gap={1}>
                            <Text fontWeight="bold">Cost to Deploy:</Text>
                            <Text>
                              • Initial Collateral:
                              <strong>{collateralAmount?.toString()} SOL</strong>
                            </Text>
                            <Text>
                              • Network Fee: <strong>{APPRX_COST_TO_DEPLOY} SOL</strong>
                            </Text>
                            <Text mt={2}>
                              Total cost is the sum of these two components:
                              <strong>{costToDeploy}</strong>
                            </Text>
                          </Flex>
                        : 'Total cost is the sum of initial collateral amount and network fee (~0.02 SOL)'
                      }
                      icon={FaQuestionCircle}
                      placement="auto"
                    />
                  </HStack>

                  <Text textStyle="body-regular-bold">{costToDeploy}</Text>
                </Flex>
                <Divider h="2px" orientation="horizontal" />
              </VStack>
            </Box>
            <Box px={{ base: 4, md: 8 }}>
              <FormFooter
                cancelText="Back"
                isLoading={isPending}
                onCancel={() => changeTab(undefined, TabMoveAction.PREV)}
                submitDisabled={lbpSettings?.isPaused}
                submitText={lbpSettings?.isPaused ? 'LBP is paused' : 'Launch'}
              />
            </Box>
          </Flex>
        </CardFooter>
      </Flex>
    </form>
  );
};

const DetailsInputPanel = ({ collateralAmount, isPending, onCreatePool }: LaunchInfoFormProps) => {
  const { draft: draftId } = useSearch({
    from: '/lbp/create/',
  });

  const [tabIndex, setTabIndex] = useAtom(tabIndexAtom);

  const { readonlyFocusedAtom: getFormStateAtom } = useGetFocusAtom('formState', draftId);
  const [formState] = useAtom(getFormStateAtom);

  useEffect(() => {
    if (draftId === 'new' && tabIndex !== 0) setTabIndex(0);
  }, [draftId, setTabIndex, tabIndex]);

  const handleTabsChange = (index?: number, forceMoveTo?: TabMoveAction) => {
    const newIndex = index ?? (forceMoveTo && tabIndex + forceMoveTo) ?? 0;
    if (forceMoveTo && !index) {
      // this condition will be applied if clicking on next tab after success
      setTabIndex(newIndex);
      window.scrollTo(0, 0);
      return;
    }

    const selectedTab = find(TabListItems, { tabIndex: newIndex });
    const tab = find(TabListItems, { tabIndex: newIndex - 1 });

    if (
      newIndex <= tabIndex ||
      (tab && formState[tab.id]) ||
      (selectedTab && formState[selectedTab.id])
    )
      setTabIndex(newIndex);
  };

  return (
    <Card variant="secondary">
      <CardHeader>
        <Flex alignItems="center" gap={4}>
          <Image
            alt="create token logo"
            bg="background.container.secondary"
            borderRadius="xl"
            boxSize={8}
            src={CoconutTree}
          />
          <Text textStyle="h3">Create Pool</Text>
        </Flex>
      </CardHeader>

      <CardBody p={0}>
        <Tabs
          colorScheme="brand"
          h="100%"
          index={tabIndex}
          onChange={handleTabsChange}
          px={tabIndex !== 3 ? { base: 1, md: 4 } : 0}
          py={4}
          size={{ base: 'base', md: 'md' }}
          variant="secondary"
          isLazy
        >
          <TabList mx={tabIndex !== 3 ? { base: 2, md: 0 } : { base: 3, md: 4 }}>
            {TabListItems.map((tab) => (
              <Tab key={tab.id}>
                <HStack gap={{ base: 1, md: 2 }}>
                  {formState[tab.id] ?
                    <CheckIcon color="surface.base.900" fill="surface.base.900" />
                  : null}
                  <Text textStyle="body-sm-bold">{tab.label}</Text>
                </HStack>
              </Tab>
            ))}
          </TabList>
          <TabPanels h="100%">
            <TabPanel h="100%">
              <TokenInfoForm changeTab={handleTabsChange} id={draftId} />
            </TabPanel>
            <TabPanel h="100%">
              <SaleDetailsForm changeTab={handleTabsChange} id={draftId} />
            </TabPanel>
            <TabPanel h="100%">
              <SocialsForm changeTab={handleTabsChange} id={draftId} />
            </TabPanel>
            <TabPanel h="100%" px={0}>
              <LaunchInfoForm
                changeTab={handleTabsChange}
                collateralAmount={collateralAmount}
                id={draftId}
                isPending={isPending}
                onCreatePool={onCreatePool}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default DetailsInputPanel;
