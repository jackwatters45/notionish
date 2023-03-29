import Icon from '@mdi/react';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { mdiDrag, mdiClose } from '@mdi/js';
import propertyData from '../../utils/helpers/propertyHelpers';
import OrderDropdown from './OrderDropdown';
import PropertyDropdown from '../Utils/PropertyDropdown';
import { doc, updateDoc } from 'firebase/firestore';
import { DatabaseContext } from '../../../context/context';

const Container = styled.div`
  margin: 6px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const LeftColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  padding: 1px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const CurrentSorts = ({ selectedView, setViews, properties }) => {
  const { userDbRef } = useContext(DatabaseContext);

  const removeSort = async (property) => {
    const updatedView = {
      ...selectedView,
      sort: selectedView.sort.filter((sort) => sort.property !== property),
    };

    setViews((prevViews) =>
      prevViews.map((view) => (view === selectedView ? updatedView : view)),
    );

    try {
      await updateDoc(doc(userDbRef, 'views', selectedView.id), updatedView);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      {selectedView.sort.map((sort) => {
        const { property, order } = sort;
        const { icon } = propertyData[property.type];
        return (
          <Row key={property.id}>
            <LeftColumn>
              <Icon path={mdiDrag} size={0.9} />
              {/*const { icon, selectedView, type, property, setViews, properties } = props;
               */}
              <PropertyDropdown
                setViews={setViews}
                type={'sort'}
                property={property}
                selectedView={selectedView}
                icon={icon}
                properties={properties}
              />
              <OrderDropdown
                property={property}
                currentSort={sort}
                selectedView={selectedView}
                order={order}
                setViews={setViews}
              />
            </LeftColumn>
            <StyledIcon
              onClick={() => removeSort(property)}
              path={mdiClose}
              size={0.8}
            />
          </Row>
        );
      })}
    </Container>
  );
};

export default CurrentSorts;
