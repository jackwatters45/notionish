import { useEffect, useState, useRef } from 'react';

const usePopup = (props = '', buttonRef) => {
  const dropdownRef = useRef();

  const [isDropdown, setIsDropdown] = useState(false);

  const getRight = () => {
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    const pickerRightLoc = buttonRect?.left + 270 ?? 0;
    return window.innerWidth - pickerRightLoc < 0 ? { right: 0 } : {};
  };

  useEffect(() => {
    const showPopup = () => setIsDropdown(true);
    const hidePopup = () => setIsDropdown(false);

    const handleClick = (e) => {
      if (buttonRef.current?.contains(e.target) && !isDropdown)
        return showPopup();

      if (isDropdown && !dropdownRef.current?.contains(e.target))
        return hidePopup();
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isDropdown) hidePopup();
    };
    window.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [buttonRef, isDropdown, dropdownRef]);

  return {
    isDropdown,
    setIsDropdown,
    style: getRight(),
    ref: dropdownRef,
    // TODO Not really sure what propId is for, but it's used in the AddNewPropertySidebar
    propId: props.name?.toLowerCase(),
    ...{ ...props },
  };
};

export default usePopup;
