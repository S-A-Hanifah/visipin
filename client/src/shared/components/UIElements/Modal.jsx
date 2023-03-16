import "./Modal.css";
import ReactDOM from "react-dom";
import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import Backdrop from "./Backdrop";

function ModalOverlay(props) {
  const { forwardRef } = props;

  const content = (
    <div
      className={`modal ${props.className}`}
      style={props.style}
      ref={forwardRef}
    >
      <header className={`modal__header  ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={props.onSubmit ? props.onSubmit : (e) => e.preventDefault()}
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
}

export default function Modal(props) {
  const { show, onCancel } = props;
  const nodeRef = useRef(null);

  return (
    <>
      {show && <Backdrop onClick={onCancel} />}
      <CSSTransition
        in={show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
        nodeRef={nodeRef}
      >
        <ModalOverlay {...props} forwardRef={nodeRef} />
      </CSSTransition>
    </>
  );
}
