import { WhatsappShareButton } from "react-share";

type ShareMenuProps = {
  isOpen: boolean;
  isMobile: boolean;
  position: {x: number, y: number},
  onCopyToClipboard: (e) => void;
};

export default function ShareMenu(props: ShareMenuProps) {
  const { isOpen, position, onCopyToClipboard } = props;

  if (!isOpen) return null;

  return (
    <div
      id="share-menu"
      style={{ top: position.y + 40, left: position.x - 75, width: 200 }}
      className={["absolute bg-highlight2 rounded-lg p-2"].join(" ")}
    >
      <div>
        <WhatsappShareButton url="url_to_share.com">
          Whatsapp
        </WhatsappShareButton>
      </div>
      <div>
        <p onClick={onCopyToClipboard}>Copy to clipboard</p>
      </div>
    </div>
  );
}
