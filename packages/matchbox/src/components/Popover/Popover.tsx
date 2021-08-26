import React from 'react';
import { PaddingProps, LayoutProps, ResponsiveValue } from 'styled-system';
import { Box } from '../Box';
import PopoverOverlay from './PopoverOverlay';
import PopoverContent from './PopoverContent';
import { onKey, onKeys } from '../../helpers/keyEvents';
import useWindowEvent from '../../hooks/useWindowEvent';
import { findFocusableChild } from '../../helpers/focus';
import type * as Polymorphic from '../../helpers/types';

type BaseProps = PaddingProps &
  LayoutProps & {
    id?: string;
    /**
     * A React component to will trigger the popover
     * Click event is handled for you if this component is uncontrolled.
     */
    trigger?: React.ReactNode;
    /**
     * Adds a padding to the Popover
     * @deprecated Use padding system props instead
     */
    sectioned?: boolean;
    /**
     * Opens the popover.
     * By default, open state is handled automatically. Passing this value in will turn this into a controlled component.
     */
    open?: boolean;
    /**
     * @deprecated Use `position` instead
     */
    left?: boolean;
    /**
     * @deprecated Use `position` instead
     */
    right?: boolean;
    /**
     * @deprecated Use `position` instead
     */
    top?: boolean;
    /**
     * @deprecated Use `position` instead
     */
    bottom?: boolean;
    position?: ResponsiveValue<'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'>;
    /**
     * Callback function that is called when clicking outside the popover, or hitting escape.
     */
    onClose?: (e: Event) => void;
    /**
     * Popover Content
     */
    children?: React.ReactNode;
    as?: 'div' | 'span';
    /**
     * @deprecated Use `as` prop instead
     */
    wrapper?: 'div' | 'span';
    portalId?: string;
    closeOnTab?: boolean;
  };

type PolymorphicPopover = Polymorphic.ForwardRefComponent<'span', BaseProps>;

const Popover = React.forwardRef<HTMLSpanElement, BaseProps>(function Popover(props, ref) {
  const {
    as,
    id,
    open: controlledOpen,
    onClose,
    children,
    trigger,
    wrapper,
    portalId,
    closeOnTab = true,
    ...rest
  } = props;
  const [open, setOpen] = React.useState(null);
  const popoverRef = React.useRef();
  const activatorRef = React.useRef();

  const shouldBeOpen = controlledOpen || open;
  const Wrapper = as || wrapper || 'span';

  useWindowEvent('click', handleOutsideClick);
  useWindowEvent('keydown', handleEsc);

  // Mount hook – sets initial close state if uncontrolled
  React.useEffect(() => {
    // This component becomes "controlled" if the prop 'open' is given a boolean value
    if (controlledOpen === undefined) {
      setOpen(false);
    }
  }, []);

  // Automatically focuses on content when opening
  React.useEffect(() => {
    if (shouldBeOpen && popoverRef && popoverRef.current) {
      const contentToFocus = findFocusableChild(popoverRef.current) || popoverRef.current;

      // Honestly not sure why this doesn't work without a timeout
      setTimeout(() => {
        contentToFocus.focus();
      }, 10);
    }
  }, [shouldBeOpen]);

  // Handles `aria-haspopup` and `aria-expanded` attributes on the activator
  React.useEffect(() => {
    if (activatorRef && activatorRef.current) {
      const activatorElem = findFocusableChild(activatorRef.current) || activatorRef.current;
      activatorElem.setAttribute('aria-haspopup', 'true');
      activatorElem.setAttribute('aria-expanded', Boolean(shouldBeOpen));
    }
  }, [trigger, activatorRef, open, controlledOpen]);

  // Toggles uncontrolled open state
  function handleUncontrolledToggle() {
    setOpen(!open);
  }

  // Focus on activator element
  // This is only called for when closing via keyboard
  function focusOnActivator() {
    if (activatorRef && activatorRef.current) {
      const activatorToFocus = findFocusableChild(activatorRef.current) || activatorRef.current;
      activatorToFocus.focus();
    }
  }

  // Toggles uncontrolled popovers on clicking outside, and calls `onClose` for controlled popovers
  function handleOutsideClick(e) {
    const isOutside =
      popoverRef.current &&
      !(popoverRef as React.MutableRefObject<HTMLDivElement>).current.contains(e.target) &&
      activatorRef.current &&
      !(activatorRef as React.MutableRefObject<HTMLDivElement>).current.contains(e.target);

    if (isOutside && shouldBeOpen) {
      if (onClose) {
        onClose(e);
      }

      if (open) {
        handleUncontrolledToggle();
      }
    }
  }

  // Toggles uncontrolled popovers on escape keydown, and calls `onClose` for controlled popovers
  function handleEsc(e) {
    if (onClose && shouldBeOpen) {
      onKey('escape', () => {
        onClose(e);
        focusOnActivator();
      })(e);
    }

    if (onClose && shouldBeOpen && closeOnTab) {
      onKey('tab', () => {
        onClose(e);
        focusOnActivator();
      })(e);
    }

    // Uncontrolled
    if (open) {
      onKey('escape', () => {
        handleUncontrolledToggle();
        focusOnActivator();
      })(e);
    }

    // Uncontrolled
    if (closeOnTab && open) {
      onKey('tab', () => {
        handleUncontrolledToggle();
        focusOnActivator();
      })(e);
    }
  }

  // Toggles uncontrolled popovers
  function handleTrigger() {
    if (open !== null) {
      handleUncontrolledToggle();
    }
  }

  function handleActivatorKey(e) {
    if (open === false) {
      onKeys(['arrowUp', 'arrowDown'], () => {
        // Stop arrow keys from scrolling the page
        e.preventDefault();
        handleUncontrolledToggle();
      })(e);
    }
  }

  // Renders popover content
  function renderPopover() {
    function assignRefs(node) {
      if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement>).current = node;
      }
      popoverRef.current = node;
    }

    return (
      <PopoverContent open={shouldBeOpen} ref={assignRefs} {...rest}>
        {children}
      </PopoverContent>
    );
  }

  // Renders popover trigger
  function renderActivator({ activatorRef: forwardedRef }) {
    function assignRefs(node) {
      forwardedRef(node);
      activatorRef.current = node;
    }

    return (
      <Box
        as={Wrapper}
        // Inline block is required to measure and set height correctly
        display={Wrapper === 'span' ? 'inline-block' : null}
        position="relative"
        onClick={handleTrigger}
        onKeyDown={handleActivatorKey}
        ref={assignRefs}
      >
        {trigger}
      </Box>
    );
  }

  return (
    <PopoverOverlay
      as={Wrapper}
      id={id}
      open={shouldBeOpen}
      renderActivator={renderActivator}
      renderPopover={renderPopover}
      portalId={portalId}
    />
  );
}) as PolymorphicPopover & {
  PopoverContent: typeof PopoverContent;
  PopoverOverlay: typeof PopoverOverlay;
};

Popover.displayName = 'Popover';

export default Popover;