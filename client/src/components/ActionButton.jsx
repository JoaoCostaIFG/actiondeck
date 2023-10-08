import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core'

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
      name: this.props.name ?? "",
      icon: getIconByName(this.props.icon ?? 'pen-to-square'),
      isDisabled: (this.props.id >= 0) ? false : true,
      width: (window.innerWidth > window.innerHeight) ? "auto" : "100%",
      height: (window.innerHeight > window.innerWidth) ? "auto" : "100%",
    };
  }

  execute() {
    if (this.state.isDisabled) return;
    fetch(`/api/execute/${this.state.id}`)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }

  render() {
    return (
      <button ref={this.inputRef} disabled={this.state.isDisabled}
          className="ActionButton relative aspect-square text-center rounded-md border border-solid border-slate-400 shadow-xl bg-violet-700 disabled:bg-transparent max-h-full max-w-full"
          style={{
            height: this.state.height,
            width: this.state.width
          }}
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
