export async function imageCommand(interaction, model) {
  await interaction.deferReply();
  
  const prompt = interaction.options.getString('prompt');
  
  try {
    // Gemini 1.5 flash can't generate images directly
    // So we use it to create a detailed prompt for now
    const result = await model.generateContent(`Create a detailed image generation prompt for this: ${prompt}`);
    const detailedPrompt = result.response.text();
    
    await interaction.editReply(`🎨 **Image Prompt:**\n${detailedPrompt}\n\n*Note: Gemini Flash can't generate images yet. Use /ask for text or upgrade to Gemini Pro with Imagen*`);
    
  } catch (error) {
    console.error('Image Error:', error);
    await interaction.editReply('❌ Failed to generate image prompt. Try again.');
  }
}
