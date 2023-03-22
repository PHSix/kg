import { FC, PropsWithChildren, useState } from "react";
import { Popover, Form } from "antd";

const { useForm } = Form;

export const EditOver: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [form] = useForm();
  const [clicked, setClicked] = useState(false);
  if (!children) throw Error("EditOver component need have a children.");
  const content = (
    <section>
      <Form form={form}></Form>
    </section>
  );
  return (
    <Popover
      title="编辑"
      content={content}
      placement="left"
      open={clicked}
    >
      <div
        onClick={() => {
          setClicked(!clicked);
        }}
      >
        {children}
      </div>
    </Popover>
  );
};
