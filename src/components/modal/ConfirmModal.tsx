import React from "react";
import { Modal, Button } from "zmp-ui";

interface ConfirmModalProps {
  visible: boolean; 
  title?: string; 
  message?: string;
  onConfirm: () => void; 
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  onConfirm,
  onCancel,
}) => {

  const handleCancel = (e) => {
    e.stopPropagation();
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleCancel}
      title={title}
    >
      <div style={{ padding: "20px" }}>
        <p style={{ marginBottom: "20px", textAlign: "center" }}>{message}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <Button
            size="medium"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            style={{ flex: 1, backgroundColor: "#ececec", color: "#000" }}
          >
            Hủy
          </Button>
          <Button
            size="medium"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            style={{ flex: 1, backgroundColor: "#007bff", color: "#fff" }}
          >
            Đồng ý
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
