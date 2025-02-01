import React from "react";
import { TextField } from "@mui/material";

type Props = {
  name: string;
  type: string;
  label: string;
};

const CustomizedInput = (props: Props) => {
  return <TextField margin="normal" InputLabelProps={{style:{color:"white"}}} name={props.name} label={props.label} type={props.type} inputProps={{style:{width:"370px", borderRadius:10, fontSize:10, color:"white"}}}/>;
};

export default CustomizedInput;
