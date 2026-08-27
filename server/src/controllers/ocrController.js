import { getGeminiModel } from '../config/gemini.js';

export const analyzeMedicalDocument = async (req, res) => {
  try {
    const { documentText, imageBase64, mimeType = 'image/jpeg', documentType = 'prescription' } = req.body;

    const model = getGeminiModel('gemini-1.5-flash');

    if (!model) {
      // Fallback mock extraction for development
      return res.status(200).json({
        success: true,
        data: {
          documentType,
          extractedSummary: "Analysis of the medical document indicates a standard prescription with antibiotics and pain relief medications.",
          medicationsFound: [
            { name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily after food", duration: "7 days" },
            { name: "Paracetamol", dosage: "500mg", frequency: "As needed for fever/pain (max 4 per day)", duration: "3 days" }
          ],
          specialInstructions: "Take full course of antibiotics as prescribed. Stay well hydrated.",
          warnings: ["Do not skip doses", "Avoid alcohol while taking medication"]
        }
      });
    }

    const systemPrompt = `
You are Tena AI's medical document analysis assistant.
Analyze this medical document or prescription image and convert it into a structured, clear, and easy-to-read clinical summary.
NO EMOJIS. Plain, clear English.
Output ONLY valid JSON with this format:
{
  "documentType": "${documentType}",
  "extractedSummary": "Clear 2-sentence summary of what this document says.",
  "medicationsFound": [
    {
      "name": "Medication Name",
      "dosage": "Dosage",
      "frequency": "Frequency",
      "duration": "Duration"
    }
  ],
  "specialInstructions": "Any specific instructions from doctor.",
  "warnings": ["Warning 1", "Warning 2"]
}
`;

    let result;
    if (imageBase64) {
      const imagePart = {
        inlineData: {
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          mimeType,
        },
      };
      result = await model.generateContent([systemPrompt, imagePart]);
    } else {
      result = await model.generateContent(`${systemPrompt}\n\nDocument Text:\n${documentText || 'Standard medical report'}`);
    }

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      documentType,
      extractedSummary: responseText,
      medicationsFound: [],
      specialInstructions: "Please verify all extracted details with your pharmacist.",
      warnings: ["Always confirm with your prescribing physician."]
    };

    return res.status(200).json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    console.error('[OCR Analysis Error]', error);
    return res.status(500).json({ success: false, message: 'Error analyzing medical document' });
  }
};
