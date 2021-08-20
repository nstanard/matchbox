import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createPropTypes } from '@styled-system/prop-types';
import { margin, layout, compose, LayoutProps, MarginProps } from 'styled-system';
import { groupByValues } from '../../helpers/array';
import { deprecate } from '../../helpers/propTypes';
import Section from './Section';
import Action from './Action';
import { onKey } from '../../helpers/keyEvents';

interface ActionListProps extends React.ComponentPropsWithRef<'div'>, LayoutProps, MarginProps {
  children?: React.ReactNode;

  /**
   * @deprecated Use the ActionList.Action component instead
   */
  actions?: React.ComponentProps<typeof Action>[];

  /**
   * @deprecated Use the ActionList.Section component instead
   */
  sections?: React.ComponentProps<typeof Action>[][];

  /**
   * @deprecated Use the ActionList.Section component instead
   */
  groupByKey?: string;
  maxHeight?: string | number;
  'aria-labelledby'?: string;
  'data-id'?: string;
}

const system = compose(margin, layout);
const Wrapper = styled('div')`
  ${system}
  overflow-y: auto;
`;

const ActionList = React.forwardRef<HTMLDivElement, ActionListProps>(function ActionList(
  props,
  userRef,
) {
  const {
    actions = [],
    'aria-labelledby': labelledBy,
    className,
    children,
    'data-id': dataId,
    id,
    sections = [],
    maxHeight = 'none',
    onClick,
    groupByKey = 'section',
    ...rest
  } = props;

  // TODO Remove `actions` and `sections` support in favor of composable components
  let list = actions && actions.length ? groupByValues(actions, groupByKey) : [];
  if (sections && sections.length) {
    list = list.concat(sections);
  }

  const listMarkup = list.map((section, index) => <Section section={section} key={index} />);

  const wrapperRef = React.useRef(null);
  const [focusableItemList, setFocusableItemList] = React.useState([]);

  const [focusIndex, setFocusIndex] = React.useState(0);

  // Creates a list of focusable links or buttons inside the actionlist
  React.useEffect(() => {
    if (!!wrapperRef && wrapperRef.current) {
      setFocusableItemList(wrapperRef.current.querySelectorAll('[role="menuitem"]'));
    }
  }, []);

  React.useLayoutEffect(() => {
    if (focusableItemList[focusIndex]) {
      // Honestly not sure why this doesn't work without a timeout
      setTimeout(() => {
        focusableItemList[focusIndex].focus();
      }, 10);
    }
  }, [focusIndex, focusableItemList]);

  function handleKeyDown(e) {
    onKey('arrowDown', () => {
      // Stop arrow keys from scrolling the page
      e.preventDefault();

      if (focusIndex < focusableItemList.length - 1) {
        setFocusIndex(focusIndex + 1);
      } else {
        setFocusIndex(0);
      }
    })(e);

    onKey('arrowUp', () => {
      // Stop arrow keys from scrolling the page
      e.preventDefault();

      if (focusIndex <= 0) {
        setFocusIndex(focusableItemList.length - 1);
      } else {
        setFocusIndex(focusIndex - 1);
      }
    })(e);
  }

  function assignRefs(node) {
    wrapperRef.current = node;
    if (userRef) {
      (userRef as React.MutableRefObject<HTMLDivElement>).current = node;
    }
  }

  return (
    <Wrapper
      aria-labelledby={labelledBy}
      className={className}
      data-id={dataId}
      id={id}
      maxHeight={typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight}
      onClick={onClick}
      tabIndex="-1"
      role="menu"
      ref={assignRefs}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {listMarkup}
      {children}
    </Wrapper>
  );
}) as React.ForwardRefExoticComponent<ActionListProps> & {
  Section: typeof Section;
  Action: typeof Action;
};

ActionList.displayName = 'ActionList';
ActionList.propTypes = {
  /**
   * Actions
   * e.g. [{ content: 'action label', onClick: callback() }]
   *
   * Note: each item can include an optional "section" key that will be used to auto group into sections, declaratively
   */
  actions: deprecate(
    PropTypes.arrayOf(PropTypes.shape({ content: PropTypes.node.isRequired })),
    'Use the ActionList.Action component instead',
  ),
  className: PropTypes.string,
  'data-id': PropTypes.string,
  'aria-labelledby': PropTypes.string,
  id: PropTypes.string,
  /**
   * Creates sections
   * e.g. [[{ content: 'action label', onClick: callback() }]]
   */
  sections: deprecate(
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({ content: PropTypes.node.isRequired }))),
    'Use the ActionList.Section component instead',
  ),

  /**
   * Max height of list
   */
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,

  /**
   * Group by key used to auto group actions into sections, defaults to "section"
   */
  groupByKey: deprecate(PropTypes.string, 'Use the ActionList.Section component instead'),
  children: PropTypes.node,
  ...createPropTypes(margin.propNames),
  ...createPropTypes(layout.propNames),
};

ActionList.Section = Section;
ActionList.Action = Action;
export default ActionList;