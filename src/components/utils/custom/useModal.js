import { useRef, useMemo, useEffect, useContext } from 'react';
import { DatabaseContext } from '../../../context/context';

const useModal = (buttonRef, closeModal) => {
  const { isModalOpen, setIsModalOpen } = useContext(DatabaseContext);
  const modalRef = useRef();

  const rightPositionStyle = useMemo(() => {
    const buttonRect = buttonRef?.current?.getBoundingClientRect();
    const pickerRightLoc = buttonRect?.left + 270 ?? 0;
    return window.innerWidth - pickerRightLoc < 0 ? { right: 0 } : {};
  }, [buttonRef]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!modalRef.current?.contains(e.target)) closeModal();
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeModal();
    };

    window.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      document.removeEventListener('mousedown', handleEscape);
    };
  }, [closeModal, modalRef]);

  useEffect(() => {
    setIsModalOpen(true);
    return () => setIsModalOpen(false);
  }, [isModalOpen, setIsModalOpen]);

  return { style: rightPositionStyle, ref: modalRef };
};

export default useModal;
