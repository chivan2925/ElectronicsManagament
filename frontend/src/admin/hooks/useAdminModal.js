import { useCallback, useMemo, useState } from "react";

export const ADMIN_MODAL_TYPES = Object.freeze({
  create: "create",
  delete: "delete",
  edit: "edit",
  view: "view",
});

function useAdminModal(initialState = {}) {
  const [modalState, setModalState] = useState({
    payload: initialState.payload ?? null,
    type: initialState.type ?? null,
  });

  const openModal = useCallback((type, payload = null) => {
    setModalState({ payload, type });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ payload: null, type: null });
  }, []);

  const helpers = useMemo(
    () => ({
      openCreate: (payload = null) => openModal(ADMIN_MODAL_TYPES.create, payload),
      openDelete: (payload = null) => openModal(ADMIN_MODAL_TYPES.delete, payload),
      openEdit: (payload = null) => openModal(ADMIN_MODAL_TYPES.edit, payload),
      openView: (payload = null) => openModal(ADMIN_MODAL_TYPES.view, payload),
    }),
    [openModal],
  );

  return {
    closeModal,
    isOpen: Boolean(modalState.type),
    modalPayload: modalState.payload,
    modalType: modalState.type,
    openModal,
    ...helpers,
  };
}

export default useAdminModal;
