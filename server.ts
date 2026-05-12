import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON (increased limit for base64 images)
  app.use(express.json({ limit: '50mb' }));

  // API Route for sending contact emails
  app.post("/api/contact", async (req, res) => {
    const { name, whatsapp, idea, placement, size, previews } = req.body;

    try {
      // Configuración de Nodemailer (Placeholder o real si hay variables de env)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'placeholder@gmail.com', // El usuario debe configurar esto
          pass: process.env.EMAIL_PASS || 'password', // Clave de aplicación
        },
      });

      // Si no hay configuración real, simulamos éxito para el demo
      if (!process.env.EMAIL_USER) {
          console.log("--- SIMULACIÓN DE ENVÍO DE EMAIL ---");
          console.log(`De: ${name} (${whatsapp})`);
          console.log(`Ubicación: ${placement} | Tamaño: ${size}`);
          console.log(`Idea: ${idea}`);
          console.log(`Adjuntos: ${previews?.length || 0} imágenes recibidas`);
          
          return res.json({ 
            success: true, 
            message: "Simulación: Email 'enviado'. Para envíos reales, configura EMAIL_USER y EMAIL_PASS en .env" 
          });
      }

      // Preparar adjuntos desde base64
      const attachments = (previews || []).map((base64: string, index: number) => ({
        filename: `referencia_${index + 1}.png`,
        content: base64.split("base64,")[1],
        encoding: 'base64'
      }));

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.TATTOO_EMAIL || process.env.EMAIL_USER, // Correo del tatuador
        subject: `Nueva Solicitud de Tatuaje: ${name}`,
        text: `
          SOLICITUD ARTININK
          
          Nombre: ${name}
          WhatsApp: ${whatsapp}
          Ubicación Corporal: ${placement}
          Tamaño Estimado: ${size}
          
          Idea/Concepto:
          ${idea}
          
          Se adjuntan ${attachments.length} imágenes de referencia.
        `,
        attachments: attachments
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Solicitud enviada correctamente." });
    } catch (error) {
      console.error("Error enviando email:", error);
      res.status(500).json({ success: false, message: "Error al enviar la solicitud." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
