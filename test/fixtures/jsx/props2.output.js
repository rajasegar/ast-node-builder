function NumberDescriber(props) {
  let description;

  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }

  return <div>{props.number}is an{description}number</div>;
}