export default async (fn, callback) => {
  try {
  const response = await fn();
  } catch (e) {
    alert(`error ${e.message}`);
    return;
  }
  return alert("it worked");
};
