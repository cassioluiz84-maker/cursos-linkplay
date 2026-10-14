import React from "react";
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
export default function Modal({ title, children, onClose }) {
  const ref = useRef(null);
  useEffect(() => { const element = ref.current; element.showModal(); return () => element.close(); }, []);
  return <dialog ref={ref} className="modal" aria-label={title} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if(event.target === event.currentTarget) onClose(); }}><div className="modal-inner"><div className="modal-heading"><h2>{title}</h2><button className="icon-button" aria-label="Fechar janela" onClick={onClose}><X size={20}/></button></div>{children}</div></dialog>;
}
