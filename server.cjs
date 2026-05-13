var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "50mb" }));
  app.post("/api/contact", async (req, res) => {
    const { name, whatsapp, idea, placement, size, previews } = req.body;
    try {
      const transporter = import_nodemailer.default.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER || "placeholder@gmail.com",
          pass: process.env.EMAIL_PASS || "password"
        }
      });
      const recipientEmail = process.env.TATTOO_EMAIL || "pevb97@gmail.com";
      if (!process.env.EMAIL_USER) {
        console.log("--- SIMULACI\xD3N DE ENV\xCDO DE EMAIL ---");
        console.log(`Para: ${recipientEmail}`);
        console.log(`De: ${name} (${whatsapp})`);
        console.log(`Ubicaci\xF3n: ${placement} | Tama\xF1o: ${size}`);
        console.log(`Idea: ${idea}`);
        console.log(`Adjuntos: ${previews?.length || 0} im\xE1genes recibidas`);
        return res.json({
          success: true,
          message: "Simulaci\xF3n: Email 'enviado'. Para env\xEDos reales, configura EMAIL_USER y EMAIL_PASS en .env"
        });
      }
      const attachments = (previews || []).map((base64, index) => ({
        filename: `referencia_${index + 1}.png`,
        content: base64.split("base64,")[1],
        encoding: "base64"
      }));
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.TATTOO_EMAIL || process.env.EMAIL_USER,
        // Correo del tatuador
        subject: `Nueva Solicitud de Tatuaje: ${name}`,
        text: `
          SOLICITUD ARTININK
          
          Nombre: ${name}
          WhatsApp: ${whatsapp}
          Ubicaci\xF3n Corporal: ${placement}
          Tama\xF1o Estimado: ${size}
          
          Idea/Concepto:
          ${idea}
          
          Se adjuntan ${attachments.length} im\xE1genes de referencia.
        `,
        attachments
      };
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Solicitud enviada correctamente." });
    } catch (error) {
      console.error("Error enviando email:", error);
      res.status(500).json({ success: false, message: "Error al enviar la solicitud." });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
