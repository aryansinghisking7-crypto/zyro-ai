export async function askCommand(interaction, model) {
  // Tell Discord we need time to think
  await interaction.deferReply();
  
  const question = interaction.options.getString('question');
  
  try {
    // Ask Gemini
    const result = await model.generateContent(question);
    const response = result.response.text();
    
    // Discord max 2000 characters
    let reply = response;
    if (reply.length > 2000) {
      reply = reply.slice(0, 1997) + '...';
    }
    
    // Send the answer
    await interaction.editReply(reply);
    
  } catch (error) {
    console.error('ZYRO Error:', error);
    await interaction.editReply('❌ ZYRO crashed. Check Render logs or try a shorter question.');
  }
}
