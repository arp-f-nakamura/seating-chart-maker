type ImportPdfButtonProps = {
  children: React.ReactNode;
  elementId: string;
  onClick: () => void;
  isAbled: boolean;
};

export const ImportPdfButton = ({
  children,
  elementId,
  onClick,
  isAbled,
}: ImportPdfButtonProps) => {
  return (
    <>
      <button onClick={() => onClick()} disabled={!isAbled}>
        座席表をダウンロード！
      </button>
      <div id={elementId}>{children}</div>
    </>
  );
};
