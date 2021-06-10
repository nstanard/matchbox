import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { margin, padding } from 'styled-system';
import { createPropTypes } from '@styled-system/prop-types';
import { Box } from '../Box';
import { ScreenReaderOnly } from '../ScreenReaderOnly';
import { pick } from '../../helpers/props';
import { Cell, HeaderCell, Row, TotalsRow } from './TableElements';
import SortButton from './SortButton';
import { TablePaddingContext } from './context';
import { table, wrapper, sticky } from './styles';

const StyledTable = styled('table')`
  ${table}
  ${padding}
  ${sticky}
`;

const Wrapper = styled(Box)`
  ${wrapper}
  ${margin}
`;

function Table(props) {
  const {
    'aria-readonly': readOnly,
    children,
    data,
    'data-id': dataId,
    freezeFirstColumn,
    id,
    role,
    title,
    ...rest
  } = props;
  const [isScrolled, setIsScrolled] = React.useState(false);
  const handleScroll = React.useCallback(
    e => {
      setIsScrolled(e.target.scrollLeft > 10);
    },
    [freezeFirstColumn],
  );
  const dataMarkup = data ? (
    <tbody>
      {data.map((rowData, i) => (
        <Row rowData={rowData} key={`Row-${i}`} />
      ))}
    </tbody>
  ) : (
    children
  );
  const { px = '450', py = '400', ...paddingProps } = pick(rest, padding.propNames);
  const marginProps = pick(rest, margin.propNames);

  return (
    <Wrapper
      freezeFirstColumn={freezeFirstColumn}
      onScroll={freezeFirstColumn ? handleScroll : null}
      {...marginProps}
    >
      <StyledTable
        aria-readonly={readOnly}
        data-id={dataId}
        freezeFirstColumn={freezeFirstColumn}
        id={id}
        isScrolled={isScrolled}
        role={role}
      >
        <TablePaddingContext.Provider value={{ px, py, ...paddingProps }}>
          {title && (
            <caption>
              <ScreenReaderOnly>{title}</ScreenReaderOnly>
            </caption>
          )}
          {dataMarkup}
        </TablePaddingContext.Provider>
      </StyledTable>
    </Wrapper>
  );
}

Table.Cell = Cell;
Table.HeaderCell = HeaderCell;
Table.Row = Row;
Table.TotalsRow = TotalsRow;
Table.SortButton = SortButton;

Table.displayName = 'Table';
Table.propTypes = {
  'aria-readonly': PropTypes.string,
  children: PropTypes.node,
  data: PropTypes.array,
  'data-id': PropTypes.string,
  freezeFirstColumn: PropTypes.bool,
  id: PropTypes.string,
  role: PropTypes.string,
  title: PropTypes.string,
  ...createPropTypes(margin.propNames),
  ...createPropTypes(padding.propNames),
};

export default Table;
