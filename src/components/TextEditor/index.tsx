import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  useColorMode,
  useDisclosure,
  useMultiStyleConfig,
} from '@chakra-ui/react';
import { RxEyeOpen } from 'react-icons/rx';
import ReactQuill from 'react-quill';

import { BasicModal } from '@components/ui/Modals';

import 'react-quill/dist/quill.snow.css';
import '@assets/css/editor.css';

const icons = ReactQuill.Quill.import('ui/icons');
icons.header['2'] = `<svg viewBox="-3 0 13 18"> 
  <path class="ql-fill" d="M16.73975.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"></path> </svg>`;

interface EditorProps {
  isInvalid: boolean;
  onChange: (value: string) => void;
  value: string;
}

const CustomToolbar = ({ onOpenPreview }: { onOpenPreview: () => void }) => (
  <Flex alignItems="center" flexDirection="row" justifyContent="space-between">
    <HStack gap={0} id="toolbar">
      <button className="ql-header" type="button" value="2" />
      <button className="ql-bold" type="button" />
      <button className="ql-italic" type="button" />
      <button className="ql-code-block" type="button" />
      <button className="ql-link" type="button" />
      <button className="ql-list" type="button" value="ordered" />
      <button className="ql-list" type="button" value="bullet" />
    </HStack>
    <Button
      leftIcon={<Icon as={RxEyeOpen} boxSize={4} />}
      mr={4}
      onClick={onOpenPreview}
      size="sm"
      variant="unstyled"
    >
      Preview
    </Button>
  </Flex>
);

const QuillEditor = ({ isInvalid, onChange, value }: EditorProps) => {
  const styles = useMultiStyleConfig('QuilEditor');

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { colorMode } = useColorMode();
  const modules = {
    toolbar: {
      container: '#toolbar',
    },
  };

  return (
    <>
      <Box
        __css={styles}
        bg="surface.base.700"
        borderColor={isInvalid ? 'danger.700' : 'surface.base.700'}
        borderRadius="xl"
        borderWidth={1}
        className={`quill-editor ${colorMode}`}
        p="2"
      >
        <CustomToolbar onOpenPreview={onOpen} />
        <ReactQuill
          modules={modules}
          onChange={onChange}
          placeholder="Describe your project..."
          value={value}
        />
      </Box>
      <BasicModal
        header={
          <HStack color="surface.base.800" textStyle="body-xs">
            <Icon as={RxEyeOpen} />
            <Text>Description preview</Text>
          </HStack>
        }
        isOpen={isOpen}
        modalBody={<Box className="editor-preview" dangerouslySetInnerHTML={{ __html: value }} />}
        modalContentProps={{ bg: 'surface.base.100' }}
        onClose={onClose}
        size={{ base: 'xs', md: 'lg' }}
      />
    </>
  );
};

export default QuillEditor;
