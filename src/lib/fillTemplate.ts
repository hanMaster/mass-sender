'use server'

// Load our library that generates the document
import Docxtemplater from 'docxtemplater'
// Load PizZip library to load the docx/pptx/xlsx file in memory
import PizZip from "pizzip";
import fs from 'fs';
import path from 'path';

export async function prepareFile() {
    // Load the docx file as binary content
    const templatePath = path.join(process.cwd(), 'templates', 'tpl_1759905729022.docx');
    console.log('filePath', templatePath);
    const content = fs.readFileSync(templatePath, "binary");

    // Unzip the content of the file
    const zip = new PizZip(content);

    /*
     * Parse the template.
     * This function throws an error if the template is invalid,
     * for example, if the template is "Hello {user" (missing closing tag)
     */
    const doc = new Docxtemplater(zip, {paragraphLoop: true, linebreaks: true,});

    /*
     * Render the document : Replaces :
     * - {first_name} with John
     * - {last_name} with Doe,
     * ...
     */
    doc.render({
        date: new Date().toLocaleDateString(),
    });

    const buf = doc.toBuffer();
    const filePath = path.join(process.cwd(), 'output', 'output.docx');
    // Write the Buffer to a file
    fs.writeFileSync(filePath, buf);
}