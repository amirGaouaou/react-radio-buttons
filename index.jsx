import React, { Component } from 'react';
import PropTypes from 'prop-types';

function getInitialCheckedIndex(children) {
  let checkedIndex;

  for (let i = 0; i < children.length; i++) {
    if (!children[i].props.disabled) {
      checkedIndex = i;
      break;
    }
  }

  return checkedIndex;
}

export class RadioGroup extends Component {
  constructor({ children, value }) {
    super();

    const index = children.findIndex(c => c.props.value === value);
    let checkedIndex 
    if (value === undefined)    // This is the case where it is not specified
      checkedIndex = -1 
    else {
      if (index > -1 && !children[index].props.disabled)
        checkedIndex = index 
      else 
        checkedIndex = getInitialCheckedIndex(children)
    }
    this.state = { checkedIndex: checkedIndex };

    this.renderChild = this.renderChild.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  get value() {
    const { checkedIndex } = this.state;
    const { children } = this.props;

    const child = children.find(c => c.props.index === checkedIndex);
    return child && child.props.value || '';
  }

// This is the case to handle late arriving props, 
// and set the state according to the value
// as long as it's not disabled
  componentWillReceiveProps(nextProps) {
    const children = this.props.children
    const index = children.findIndex(c => c.props.value === nextProps.value && !c.props.disabled);
    if (index !== -1 && index !== this.state.checkedIndex) {
      this.setState({ checkedIndex: index });
    }
  }

  onChange(index) {
    const { onChange, children } = this.props;
    const child = children[index];
    if (!child) return;

    this.setState({ checkedIndex: index });
    onChange && onChange(child.props.value || '');
  }

  renderChild(child, index, checked) {
    const { children, horizontal } = this.props;
    return React.cloneElement(child, {
      horizontal, index, checked,
      key: index,
      last: index === children.length - 1,
      onChange: this.onChange, ...child.props
    });
  }

  render() {
    const { checkedIndex } = this.state;
    const { horizontal, children, ...props } = this.props;
    const style = horizontal ? { display: 'inline-flex', width: '100%' } : {};
    return (
      <div style={style} {...props}>
        {
          children.map((c, i) => (this.renderChild(c, i, i === checkedIndex)))
        }
      </div>
    );
  }
}

RadioGroup.propTypes = {
  horizontal: PropTypes.bool,
  children: PropTypes.node,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export class RadioButton extends Component {
  constructor() {
    super();
    this.getStyles = this.getStyles.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  getStyles() {
    const { horizontal, last, padding, rootColor, pointColor, disabled, disabledColor, label } = this.props;

    return {
      root: {
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? (disabledColor || '#e1e1e1') : (rootColor),
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: disabled ? (disabledColor || '#e1e1e1') : (rootColor ),
        borderRadius: 1,
        padding: padding || 16,
        flex: 1,
        marginBottom: horizontal ? 0 : label ? (padding || 16) / 2 : (padding || 16),
        marginRight: horizontal && !last ? (padding || 16) / 2 : 0,
      },
      label: {
        color: pointColor || '#8CB9FD',
        borderStyle: 'none',
        padding: padding || 8,
        marginBottom: horizontal ? 0 : (padding || 8),
        marginRight: horizontal && !last ? (padding || 8) / 2 : 0
      },
      checked: {
        borderColor: pointColor || '#8CB9FD',
        color: pointColor || '#8CB9FD',
      },
    };
  }

  onClick() {
    const { onChange, checked, index, disabled } = this.props;
    !disabled && onChange && onChange(index);
  }

  render() {
    const { checked, iconSize, rootColor, pointColor, children, disabled, disabledColor, label, hidden, iconMarginTop, iconLocation } = this.props;
    const style = this.getStyles();
    const buttonStyle = Object.assign({}, style.root, checked ? style.checked : {});
    const labelStyle = Object.assign({}, style.root, style.label)

    return (

      <div className={`radio-button ${checked ? 'checked' : ''}`} style={buttonStyle} onClick={this.onClick}>
        <div style={{ display: 'inline-flex', width: '100%' }}>
          <div style={{ flex: 1 }}>
            {children}
          </div>
          { 
            hidden ? undefined : 
            <RadioIcon size={iconSize}
              checked={checked} rootColor={rootColor} pointColor={pointColor}
              disabled={disabled} disabledColor={disabledColor} iconLocation={iconLocation} iconMarginTop={iconMarginTop}
            />
          }
        </div>
        {
          label ? (
            <div style={labelStyle}>
              <div>{label}</div>
            </div>
            ) : ''
        }
      </div>
    );
  }
}

RadioButton.propTypes = {
  iconSize: PropTypes.number,
  iconLocation: PropTypes.string,
  iconMarginTop: PropTypes.string,
  hidden: PropTypes.bool,
  padding: PropTypes.number,
  rootColor: PropTypes.string,
  pointColor: PropTypes.string,
  value: PropTypes.string,
  index: PropTypes.number,
  checked: PropTypes.bool,
  children: PropTypes.node,
  horizontal: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  disabledColor: PropTypes.string,
  label: PropTypes.string
};

export class ReversedRadioButton extends Component {
  constructor() {
    super();
    this.getStyles = this.getStyles.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  getStyles() {
    const { horizontal, last, padding, rootColor, pointColor, disabled, disabledColor, label } = this.props;
    return {
      root: {
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? (disabledColor || '#e1e1e1') : (rootColor),
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: disabled ? (disabledColor || '#e1e1e1') : (rootColor),
        borderRadius: 1,
        padding: padding || 16,
        flex: 1,
        marginBottom: horizontal ? 0 : (padding || 16),
        marginRight: horizontal && !last ? (padding || 16) / 2 : 0,
      },
      label: {
        color: pointColor || '#8CB9FD',
        borderStyle: 'none',
        padding: padding || 8,
        marginBottom: horizontal ? 0 : (padding || 8),
        marginRight: horizontal && !last ? (padding || 8) / 2 : 0
      },
      checked: {
        borderColor: pointColor || '#8CB9FD',
        color: pointColor || '#8CB9FD',
      },
    };
  }

  onClick() {
    const { onChange, checked, index, disabled } = this.props;
    !disabled && onChange && onChange(index);
  }

  render() {
    const { checked, iconSize, rootColor, pointColor, children, disabled, disabledColor, padding, label, hidden, iconLocation, iconMarginTop } = this.props;
    const style = this.getStyles();
    const buttonStyle = Object.assign({}, style.root, checked ? style.checked : {});
    const labelStyle = Object.assign({}, style.root, style.label)
    return (
      <div className={`radio-button ${checked ? 'checked' : ''}`} style={buttonStyle} onClick={this.onClick}>
        <div style={{ display: 'inline-flex', width: '100%' }}>
          { hidden ? undefined : 
            <RadioIcon size={iconSize}
              checked={checked} rootColor={rootColor} pointColor={pointColor}
              disabled={disabled} disabledColor={disabledColor} iconLocation={iconLocation}
              marginRight={padding || 16} iconMarginTop={iconMarginTop}
            />
          }     
          <div style={{ flex: 1 }}>
            {children}
          </div>
        </div>
        {
          label ? (
            <div style={labelStyle}>
              <div>{label}</div>
            </div>
            ) : ''
        }
      </div>
    );
  }
}

ReversedRadioButton.propTypes = {
  iconSize: PropTypes.number,
  iconLocation: PropTypes.string,
  iconMarginTop: PropTypes.string,
  hidden: PropTypes.bool,
  padding: PropTypes.number,
  rootColor: PropTypes.string,
  pointColor: PropTypes.string,
  value: PropTypes.string,
  index: PropTypes.number,
  checked: PropTypes.bool,
  children: PropTypes.node,
  horizontal: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  disabledColor: PropTypes.bool,
  label: PropTypes.string
};

export class RadioIcon extends Component {
  constructor() {
    super();
    this.getStyles = this.getStyles.bind(this);
  }

  getStyles() {
    const { size, rootColor, pointColor, disabled, disabledColor, marginRight, iconLocation, iconMarginTop, checked } = this.props;
    let alignSelf = 'flex-start'
    if ( iconLocation === "center") {
      alignSelf = 'center'
    } else if (iconLocation === 'bottom') { 
      alignSelf = 'flex-end'
    }
    return {
      root: {
        width: size || 10,
        height: size || 10,
        backgroundColor: checked ? (pointColor || '#8CB9FD') : '#FFF',
        borderWidth: 2,
        borderRadius: '50%',
        borderStyle: 'solid',
        borderColor: disabled ? (disabledColor || '#e1e1e1') : (rootColor),
        marginRight: marginRight || 0,
        alignSelf: alignSelf,
        marginTop: iconMarginTop
      },
      checked: {
        borderColor: pointColor || '#8CB9FD',
      },
    }
  }

  render() {
    const { checked } = this.props;
    const style = this.getStyles();
    const iconStyle = Object.assign(style.root, checked ? style.checked : {});
    return (
      <div className={`radio-icon ${checked ? 'checked' : ''}`} style={iconStyle}>
      </div>
    );
  }
}

RadioIcon.propTypes = {
  size: PropTypes.number,
  iconLocation: PropTypes.string,
  iconMarginTop: PropTypes.string,
  rootColor: PropTypes.string,
  pointColor: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  disabledColor: PropTypes.string,
  marginRight: PropTypes.number,
};
