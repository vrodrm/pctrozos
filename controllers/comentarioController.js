import { Comentario } from "../models/index.js"
import crypto from "node:crypto";

export const postComment = async (req, res) => {
  const { content, buildId } = req.body;

  try {
    await Comentario.create({
      id: crypto.randomUUID(),
      contenido: content,
      buildId: buildId,
      userId: req.session.user?.id ?? null
    });

    res.redirect(req.get('Referer'));
  } catch (error) {
    console.log(error);
    res.redirect(req.get('Referer'));
  }
}
