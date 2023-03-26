import { FC, PropsWithChildren, useState } from "react";
import { Popover, Form } from "antd";

const { useForm } = Form;

export const CreateOver: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [form] = useForm();
  const [clicked, setClicked] = useState(false);
  if (!children) throw Error("CreateOver component need have a children.");
  const content = (
    <section>
      <Form form={form}></Form>
    </section>
  );
  return (
    <Popover title="新增" content={content} placement="left">
      <span
        onClick={() => {
          setClicked(!clicked);
        }}
      >
        {children}
      </span>
    </Popover>
  );
};
