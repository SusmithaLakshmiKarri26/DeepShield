import React, { useEffect, useState } from "react";

const StatusDot = ({ up }) => (
  <span
    className={`inline-block w-2 h-2 rounded-full mr-1 ${up ? "bg-green-500" : "bg-red-500"}`}
  />
);

const StatusBadge = () => {
  const [nodeUp, setNodeUp] = useState(false);
  const [pyUp, setPyUp] = useState(false);

  const nodeBase = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";
  const pyBase = process.env.REACT_APP_PY_URL || "http://127.0.0.1:5001";

  const pingNode = async () => {
    try {
      const res = await fetch(`${nodeBase}/api/encrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: "ping", password: "x" })
      });
      setNodeUp(res.ok);
    } catch {
      setNodeUp(false);
    }
  };

  const pingPy = async () => {
    try {
      const res = await fetch(`${pyBase}/health`);
      setPyUp(res.ok);
    } catch {
      setPyUp(false);
    }
  };

  useEffect(() => {
    pingNode();
    pingPy();
    const id = setInterval(() => {
      pingNode();
      pingPy();
    }, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="flex items-center">
        <StatusDot up={nodeUp} />
        <span className="text-[#140033] dark:text-[#ccc]">API</span>
      </div>
      <div className="flex items-center">
        <StatusDot up={pyUp} />
        <span className="text-[#140033] dark:text-[#ccc]">Python</span>
      </div>
    </div>
  );
};

export default StatusBadge;
