import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import Color from 'color';

const defaultName = "";
const defaultIcon = "pen-to-square";
const defaultBg = "#6d28d9";
const defaultFg = "#f1f5f9";

function getIconByName(iconName) {
  let icon = findIconDefinition({ prefix: "fas", iconName: iconName });
  if (icon !== undefined) {
    return icon;
  }
  return findIconDefinition({ prefix: "fab", iconName: iconName });;
}

class ActionButton extends React.Component {
  inputRef = React.createRef(null);

  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id,
      name: this.props.name ?? defaultName,
      icon: getIconByName(this.props.icon ?? defaultIcon),

      fg: Color(this.props.fg ?? defaultFg),
      bg: Color(this.props.bg ?? defaultBg),

      isDisabled: (this.props.id >= 0) ? false : true,
      width: (window.innerWidth > window.innerHeight) ? "auto" : "100%",
      height: (window.innerHeight > window.innerWidth) ? "auto" : "100%",
    };

    this.state.bgHover = this.state.bg.darken(0.1);
  }

  execute() {
    if (this.state.isDisabled) return;
    fetch(`/api/execute/${this.state.id}`)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }

  render() {
    let style = {
      height: this.state.height,
      width: this.state.width,
      color: this.state.fg.hex(),
    };
    if (!this.state.isDisabled) {
      style.backgroundColor = this.state.bg.hex();
    }

    return (
      <button ref={this.inputRef} disabled={this.state.isDisabled}
        className="ActionButton relative aspect-square text-center rounded-md border border-solid border-slate-400 shadow-xl max-h-full max-w-full disabled:bg-transparent disabled:brightness-100 hover:brightness-90 active:brightness-75"
          style={style}
          onClick={() => this.execute()}>
        <span className="absolute top-0 left-0 w-full">{this.props.name}</span>
        <FontAwesomeIcon icon={this.state.icon} />
      </button>
    );
  }

  updateDimensions = () => {
    const parent = this.inputRef.current.parentNode;
    const width = parent.offsetWidth;
    const height = parent.offsetHeight;
    // const rect = this.inputRef.current.getBoundingClientRect();
    // const width = rect.width;
    // const height = rect.height;
    this.setState({
      width: (width > height) ? "auto" : "100%",
      height: (height > width) ? "auto" : "100%",
    });
  };

  // componentDidUpdate() {
  //   const parent = this.inputRef.current.parentNode;
  //   const width = parent.offsetWidth;
  //   const height = parent.offsetHeight;
  //   // const rect = this.inputRef.current.getBoundingClientRect();
  //   // const width = rect.width;
  //   // const height = rect.height;
  //   this.state.width = (width > height) ? "auto" : "100%";
  //   this.state.height = (height > width) ? "auto" : "100%";
  // }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
}

export default ActionButton;
