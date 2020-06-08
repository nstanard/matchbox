import { tokens } from '@sparkpost/design-tokens';

export const base = () => `
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: ${tokens.borderRadius_100};
  user-select: none;
  font-weight: ${tokens.fontWeight_medium};
  justify-content: center;
  text-decoration: none;
  white-space: nowrap;
  transition-property: background, color, border, outline;
  transition-duration: ${tokens.motionDuration_fast};
  border: 1px solid transparent;
  cursor: pointer;
  overflow: hidden;  
`;

export const childwrapper = props => `
  transition: ${tokens.motionDuration_fast} ${tokens.motionEase_in_out};
  transform: translateY(${props.loading ? '-50%' : '0%'});
  opacity: ${props.loading ? '0' : '1'};
`;

export const loader = props => `
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
  user-select: none
  opacity: ${props.state === 'entered' ? '1' : '0'};
  transform: ${props.state === 'entered' ? 'translate(0%, 0%)' : 'translate(0%, 40%)'};
  transition: ${tokens.motionDuration_fast} ${tokens.motionEase_in_out};
`;

export const visualSize = props => {
  switch (props.buttonSize) {
    case 'large':
      return `
        height: ${tokens.sizing_750};
        font-size: ${tokens.fontSize_300};
        padding: 0 ${tokens.spacing_500};
      `;
    case 'small':
      return `
        height: ${tokens.sizing_600};
        font-size: ${tokens.fontSize_200};
        padding: 0 ${tokens.spacing_400};
      `;
    case 'default':
    default:
      return `
        height: ${tokens.sizing_650};
        font-size: ${tokens.fontSize_200};
        padding: 0 ${tokens.spacing_400};
      `;
  }
};

export const colorVariant = props => {
  let color;
  let hoverColor;

  switch (props.buttonColor) {
    case 'orange': // To be deprecated
    case 'blue':
      color = tokens.color_blue_700;
      hoverColor = tokens.color_blue_800;
      break;

    case 'red':
      color = tokens.color_red_700;
      hoverColor = tokens.color_red_800;
      break;

    case 'gray':
    default:
      color = tokens.color_gray_900;
      hoverColor = tokens.color_gray_1000;
      break;
  }

  switch (props.visualWeight) {
    case 'strong':
      return `
        &, &:visited {
          background: ${color};
          color: ${tokens.color_white};

          &:hover {
            ${!props.disabled ? `background: ${hoverColor};` : ''}
          }
          &:focus, &:hover {
            color: ${tokens.color_white};
          }
        }
      `;
    case 'weak':
      return `
        &, &:visited {
          background: transparent;
          color: ${color};
          &:hover {
            ${!props.disabled ? `background: ${tokens.color_gray_200};` : ''}
          }
          &:focus, &:hover {
            color: ${color};
          }
        }
      `;
    case 'normal':
    case 'outline':
    default:
      return `
        &, &:visited {
          border: 1px solid ${props.visualWeight == 'outline' ? tokens.color_gray_400 : color};
          background: transparent;
          color: ${color};
          &:hover {
            ${!props.disabled ? `background: ${tokens.color_gray_200};` : ''}
          }
          &:focus, &:hover {
            color: ${color};
          }
        }
      `;
  }
};

export const disabled = props => {
  if (props.disabled) {
    return `
      opacity: 0.6;
      &:hover {
        cursor: not-allowed;
      }
    `;
  }
};

export const fullWidth = props => {
  if (props.fullWidth) {
    return `
      display: block;
      width: 100%;
    `;
  }
};

// This selector is intentionally loose to handle buttons wrapped in other components such as tooltips
export const group = () => `
  & > * {
    margin-right: -1px;
  }
`;
