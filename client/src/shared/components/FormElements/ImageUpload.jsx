import { useEffect, useRef, useState } from "react";
import Button from "./Button";

import "./ImageUpload.css";

export default function ImageUpload(props) {
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      return setPreview(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const previewImg = (e) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (e.target.files && e.target.files.length !== 0) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImage = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={previewImg}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {preview && <img src={preview} alt="preview" />}
          {!preview && <p>Image Please</p>}
        </div>
        <Button type="button" onClick={pickImage}>
          Choose an Image
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
}
