import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiDrag } from '@mdi/js';
import { DatabaseContext } from '../../utils/context/context';
import uniqid from 'uniqid';

const DropdownContainer = styled.div`
  position: absolute;
  width: 270px;
  background: var(--secondary-background-color);
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  border-radius: 20px;
  overflow: hidden;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;

const Current = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  cursor: text;
  box-shadow: rgb(255 255 255 / 13%) 0px -1px inset;
  max-height: 240px;
  min-height: 34px;
  padding: 0 8px;
  gap: 8px;
`;

const CategoryName = styled.div`
  display: inline-flex;
  align-items: center;
  min-width: 0px;
  height: 20px;
  border-radius: 3px;
  padding: 0 6px;
  font-size: 14px;
  line-height: 120%;
  color: rgba(255, 255, 255, 0.804);
  background: rgb(90, 90, 90);
`;

const StyledInput = styled.input``;

const Categories = styled.div`
  padding: 6px 4px;
`;

const StyledOptionsText = styled.div`
  font-size: 12px;
  color: var(--secondary-font-color);
  margin-left: 8px;
  font-weight: 700;
`;

const DropdownRow = styled.div`
  display: flex;
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  margin: 0 4px;
  padding: 0 4px;
  height: 28px;
  align-items: center;
  border-radius: 4px;
  gap: 8px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const SelectDropdown = forwardRef(({ style, data, propId }, ref) => {
  const { setTodos, todos, projects, setProjects } =
    useContext(DatabaseContext);

  const selectProject = (project) => {
    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) => id === data.id);
    todoCopy[propId] = project;
    setTodos(todosCopy);
  };

  const currentValueRef = useRef();
  const [inputWidth, setInputWidth] = useState(1);
  useEffect(() => {
    setInputWidth(
      !currentValueRef.current
        ? 253
        : 245 - currentValueRef.current.offsetWidth,
    );
  }, [todos]);

  const [input, setInput] = useState('');
  const handleChange = (e) => setInput(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;

    const newProject = { name: input, id: uniqid() };

    setProjects([...projects, newProject]);
    selectProject(newProject);
    setInput('');
  };

  return (
    <DropdownContainer ref={ref} style={style}>
      <Current>
        {data.project && (
          <CategoryName ref={currentValueRef}>{data.project.name}</CategoryName>
        )}
        <StyledInput
          autoFocus
          style={{ width: `${inputWidth}px` }}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </Current>
      <Categories>
        <StyledOptionsText>Select an option or create one</StyledOptionsText>
        {projects.map((project) => (
          <DropdownRow key={project.id} onClick={() => selectProject(project)}>
            <Icon
              path={mdiDrag}
              size={0.85}
              color={'var(--secondary-font-color)'}
            />
            <CategoryName>{project.name}</CategoryName>
          </DropdownRow>
        ))}
      </Categories>
    </DropdownContainer>
  );
});

export default SelectDropdown;
