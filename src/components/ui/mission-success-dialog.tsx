import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface MissionSuccessDialogProps {
    imageUrl?: string;
    title?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
}

export const MissionSuccessDialog = ({
    imageUrl = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop",
    title = "¡Solicitud Recibida!",
    description = "Tu mensaje ha llegado a Punto Veterinario. Te responderemos por WhatsApp o correo muy pronto.",
    primaryButtonText = "💬 Abrir WhatsApp ahora",
    primaryButtonHref = "https://wa.me/525513843004",
    secondaryButtonText = "Cerrar ventana"
}: MissionSuccessDialogProps) => {

    const [isOpen, setIsOpen] = React.useState(false);

    const onClose = () => setIsOpen(false);
    const onPrimaryClick = () => {
        window.open(primaryButtonHref, '_blank');
        onClose();
    };
    const onSecondaryClick = () => onClose();

    React.useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener("abrir-exito", handleOpen);
        return () => window.removeEventListener("abrir-exito", handleOpen);
    }, []);

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-[max(1rem,3vw)]">
                    {/* Backdrop con Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Dialog Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 30 }}
                        className="relative z-10 w-full overflow-hidden bg-white shadow-2xl"
                        style={{
                            width: 'clamp(20rem, 35vw, 40rem)',
                            padding: 'max(1.5rem, 3vw)',
                            borderRadius: 'max(1rem, 2vw)',
                            border: 'none',
                            margin: 'auto'
                        }}
                    >
                        {/* Close Button X */}
                        <button
                            onClick={onClose}
                            className="absolute right-[max(1rem,2vw)] top-[max(1rem,2vw)] text-gray-400 hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
                        >
                            <X style={{ width: 'max(1.5rem, 2.5vw)', height: 'max(1.5rem, 2.5vw)' }} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            {/* Imagen Escalable */}
                            <div className="mx-auto flex items-center justify-center"
                                style={{
                                    height: 'max(8rem, 12vw)',
                                    width: 'max(8rem, 12vw)',
                                    marginBottom: 'max(0.8rem, 1.5vw)'
                                }}
                            >
                                <img src={imageUrl} alt="Success" className="h-full w-full object-contain drop-shadow-xl" />
                            </div>

                            {/* Título Vectorial */}
                            <h2 className="flex items-center justify-center gap-2 font-bold text-primary-dark text-center leading-tight m-0"
                                style={{ fontSize: 'max(1.4rem, 2.5vw)', marginBottom: 'max(0.4rem, 0.8vw)', color: 'var(--color-primary-dark)' }}>
                                <Zap className="text-yellow-400" style={{ width: 'max(1.5rem, 2.2vw)', height: 'max(1.5rem, 2.2vw)' }} />
                                {title}
                            </h2>

                            {/* Descripción */}
                            <p className="text-gray-500 text-center m-0"
                                style={{ fontSize: 'max(0.9rem, 1.2vw)', lineHeight: '1.5', marginBottom: 'max(1.2rem, 2vw)', color: 'var(--color-text-soft)' }}>
                                {description}
                            </p>

                            {/* Botonera Vertical */}
                            <div className="flex flex-col w-full" style={{ gap: 'max(0.8rem, 1.2vw)' }}>
                                <Button
                                    onClick={onPrimaryClick}
                                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-md hover:shadow-lg no-underline cursor-pointer"
                                    style={{
                                        height: 'max(3rem, 4.5vw)',
                                        fontSize: 'max(0.95rem, 1.3vw)',
                                        borderRadius: 'max(0.6rem, 1vw)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {primaryButtonText}
                                </Button>

                                <button
                                    onClick={onSecondaryClick}
                                    className="text-gray-400 font-medium hover:text-primary transition-colors border-none bg-transparent cursor-pointer"
                                    style={{ fontSize: 'max(0.9rem, 1.2vw)', marginTop: 'max(0.5rem, 1vw)' }}
                                >
                                    {secondaryButtonText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
