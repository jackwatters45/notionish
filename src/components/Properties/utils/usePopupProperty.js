import { useEffect, useState, useContext, useRef } from 'react';
import { SidebarContext } from '../../MainContent';

const usePopupProperty = (props, buttonRef) => {
  const { setIsPopupVisible } = useContext(SidebarContext);
  const { property, todo } = props;
  const dropdownRef = useRef();

  const [isDropdown, setIsDropdown] = useState(false);

  const getRight = () => {
    if (!buttonRef.current) return;
    const pickerRightLoc = buttonRef.current.getBoundingClientRect().left + 270;
    // if greater than 0 nothing, if less right: 0
    return window.innerWidth - pickerRightLoc < 0 ? { right: 0 } : {};
  };

  useEffect(() => {
    const showDatePicker = () => {
      setIsPopupVisible(true);
      setIsDropdown(true);
    };
    const hideDatePicker = () => {
      setIsPopupVisible(false);
      setIsDropdown(false);
    };

    const handleClick = (e) => {
      // TODO if error, try add this -> e.target === buttonRef.current
      if (buttonRef.current.contains(e.target) && !isDropdown)
        return showDatePicker();

      if (isDropdown && !dropdownRef.current.contains(e.target))
        return hideDatePicker();
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isDropdown) hideDatePicker();
    };
    window.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdown, buttonRef, setIsPopupVisible]);

  return {
    isDropdown,
    style: getRight(),
    ref: dropdownRef,
    propId: property,
    todo: todo,
  };
};

export default usePopupProperty;
