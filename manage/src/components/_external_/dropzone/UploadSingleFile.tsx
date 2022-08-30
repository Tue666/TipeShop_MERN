import { ReactNode } from 'react';
import styled from 'styled-components';
import { Typography, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDropzone, DropzoneOptions } from 'react-dropzone';

// models
import { UploadFileType } from '../../../models';
// utils
import { humanFileSize } from '../../../utils/formatNumber';
import { distinguishImage } from '../../../utils/formatImage';

const { Text } = Typography;

interface UploadSingleFileProps extends DropzoneOptions {
  file: UploadFileType;
  caption?: ReactNode;
  error?: boolean;
  showRejected?: boolean;
  style?: { [key: string]: string | number };
}

const UploadSingleFile = ({
  accept,
  file,
  caption,
  error,
  showRejected,
  style,
  ...others
}: UploadSingleFileProps) => {
  const { fileRejections, isDragActive, isDragReject, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept,
    ...others,
  });
  const rejectedItems = (
    <div>
      {fileRejections.map(({ file, errors }, index) => {
        const { name, size } = file;
        return (
          <Tag key={index} color="error" style={{ whiteSpace: 'normal' }}>
            <div>
              <Text strong>
                {name} - {humanFileSize(size)}
              </Text>
              <div style={{ paddingLeft: '5px' }}>
                {errors.map((error) => (
                  <Text key={error.code} className="caption">
                    {error.message} <br />
                  </Text>
                ))}
              </div>
            </div>
          </Tag>
        );
      })}
    </div>
  );
  return (
    <>
      <RootStyle
        style={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || fileRejections.length > 0 || error) && { borderColor: 'red' }),
          ...style,
        }}
      >
        <DropzoneStyle {...getRootProps()}>
          <input {...getInputProps()} />
          {file && (
            <img
              alt=""
              src={typeof file === 'string' ? distinguishImage(file) : file.preview}
              style={{ zIndex: 1 }}
            />
          )}
          <PlaceholderStyle className="placeholder">
            <UploadOutlined />
            <Text>{file ? 'Update image' : 'Upload image'}</Text>
          </PlaceholderStyle>
        </DropzoneStyle>
      </RootStyle>
      {caption}
      {showRejected && rejectedItems}
    </>
  );
};

const RootStyle = styled.div({
  width: '100%',
  height: '300px',
  padding: '10px',
  border: '1px dashed rgba(145, 158, 171, 0.32)',
});

const DropzoneStyle = styled.div({
  zIndex: 0,
  position: 'relative',
  width: '100%',
  height: '100%',
  cursor: 'pointer',
  display: 'flex',
  '& > *': {
    width: '100%',
    height: '100%',
  },
  '&:hover > .placeholder': {
    zIndex: 2,
  },
});

const PlaceholderStyle = styled.div({
  position: 'absolute',
  color: 'rgb(99, 115, 129)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgb(244, 246, 248)',
  '&:hover': { opacity: 0.72 },
});

export default UploadSingleFile;
