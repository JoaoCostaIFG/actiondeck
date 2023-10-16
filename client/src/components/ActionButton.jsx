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
      width: (window.innerWidth > window.innerHeight) ? "auto" : "100%",
      height: (window.innerHeight > window.innerWidth) ? "auto" : "100%",
    };
  }

  execute() {
    if (this.props.isDisabled) return;
    fetch(`/api/execute/${this.props.id}`)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }

  render() {
    const style = {
      height: this.state.height,
      width: this.state.width,
      color: new Color(this.props.fg ?? defaultFg).hex(),
    };
    if (!this.props.isDisabled) {
      style.backgroundColor = new Color(this.props.bg ?? defaultBg).hex();
    }

    return (
      <button ref={this.inputRef} disabled={this.props.isDisabled}
        className="ActionButton relative aspect-square text-center rounded-md border border-solid border-slate-400 shadow-xl max-h-full max-w-full disabled:bg-transparent disabled:brightness-100 hover:brightness-90 active:brightness-75"
          style={style}
          onClick={() => this.execute()}>
        <span className="absolute top-0 left-0 w-full">{this.props.name ?? defaultName}</span>
        <FontAwesomeIcon icon={getIconByName(this.props.icon ?? defaultIcon)} />
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

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
}

export default ActionButton;
