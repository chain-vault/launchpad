import { defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

/* eslint-disable perfectionist/sort-objects */

const QuillEditor = defineStyleConfig({
  baseStyle: (props) => ({
    /** Quill container styles */
    '.ql-container': {
      fontFamily: 'Gilroy',
    },
    '.ql-container.ql-snow': {
      minHeight: '90px',
    },

    /** toolbar */

    '.ql-toolbar.ql-snow, .ql-container.ql-snow': {
      border: 'none',
    },
    '.ql-toolbar .ql-stroke': {
      fill: 'none',
      stroke: mode('base.500', 'base.400')(props),
    },
    '.ql-toolbar .ql-fill': {
      fill: mode('base.500', 'base.400')(props),
      stroke: 'none',
    },
    '.ql-toolbar .ql-picker': {
      color: mode('base.500', 'base.400')(props),
    },
    'button:hover .ql-stroke, .ql-picker-label:hover .ql-stroke': {
      fill: 'none',
      stroke: `${mode('base.800', 'base.100')(props)} !important`,
    },
    '.ql-active .ql-stroke': {
      fill: 'none',
      stroke: `${mode('base.800', 'base.100')(props)} !important`,
    },
    'button:hover .ql-fill': {
      fill: `${mode('base.800', 'base.100')(props)} !important`,
      stroke: 'none',
    },
    '.ql-active .ql-fill': {
      fill: `${mode('base.800', 'base.100')(props)} !important`,
      stroke: 'none',
    },

    '.ql-snow.ql-toolbar button:hover, .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-label:hover':
      {
        color: `${mode('base.800', 'base.100')(props)}`,
        backgroundColor: mode('base.400', 'base.500')(props),
        borderRadius: '6px',
      },
    '.ql-snow.ql-toolbar button.ql-active': {
      backgroundColor: mode('base.400', 'base.500')(props),
      borderRadius: '6px',
    },

    /** Editor styles */
    '.quill-editor': {
      background: 'black',
    },
    '.ql-editor.ql-blank::before': {
      fontSize: 'md',
      opacity: 0.3,
      fontStyle: 'normal',
      color: mode('base.800', 'base.100')(props),
    },

    '@media (max-width: 768px)': {
      '.ql-snow.ql-toolbar button': {
        padding: '3px 0px',
        width: '24px',
        height: '20px',
      },
    },
  }),
});

export default QuillEditor;
