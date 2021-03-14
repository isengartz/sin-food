import { useEffect, useRef } from 'react';
import { FormInstance } from 'antd';

/**
 * Used to reset form field when using Form inside a modal
 * @param form
 * @param visible
 */
const useResetFormOnCloseModal = ({
  form,
  visible,
}: {
  form: FormInstance;
  visible: boolean;
}) => {
  const prevVisibleRef = useRef<boolean>();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);
  const prevVisible = prevVisibleRef.current;

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
};

export default useResetFormOnCloseModal;
