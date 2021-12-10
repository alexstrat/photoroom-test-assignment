import React from 'react';
import SwitchSelector from 'react-switch-selector';

import './ImagePreview.css';

type ImagePreviewProps = {
  base64Original: string
  base64Result?: string;
}
const ImagePreview = ({
  base64Original,
  base64Result
}: ImagePreviewProps) => {
  const [val, setVal] = React.useState<'original' | 'result'>('original' as const)
  return (
    <div className={'ImagePreview'}>
      {
        val === 'original' ? (
          <img src={base64Original} width={300} alt="Original" />
          ): (
            base64Result ? <img src={base64Result} width={300} alt="Wihout background" /> : <span>No result yet</span>
        )
      }
      <div>
        <SwitchSelector
          // @ts-expect-error problem with lib typing
          onChange={setVal}
          options={[{
            label: 'Original',
            value: 'original' as const
          }, {
            value: 'result' as const,
            label: 'Without Background'
          }]}
          initialSelectedIndex={0}
          backgroundColor={"#353b48"}
          fontColor={"#f5f6fa"}
        />
      </div>
    </div>
  )
}

export default ImagePreview