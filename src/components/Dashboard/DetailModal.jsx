import React from 'react';

export default function DetailModal({ title, children, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 style={{ color: '#fff', fontSize: '1.2rem' }}>{title}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}
