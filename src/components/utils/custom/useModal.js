import { useRef, useMemo, useLayoutEffect } from 'react';

const useModal = (buttonRef, closeModal) => {
  const modalRef = useRef();

  const rightPositionStyle = useMemo(() => {
    const buttonRect = buttonRef?.current?.getBoundingClientRect();
    const pickerRightLoc = buttonRect?.left + 270 ?? 0;
    return window.innerWidth - pickerRightLoc < 0 ? { right: 0 } : {};
  }, [buttonRef]);

  useLayoutEffect(() => {
    const handleClick = (e) => {
      if (!modalRef.current?.contains(e.target)) return closeModal();
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

  // console.log('modal active');

  return { style: rightPositionStyle, ref: modalRef };
};

export default useModal;
