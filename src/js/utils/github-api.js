/**
 * GitHub REST API Helper for Direct Commit
 */

export async function commitReadmeToGithub({ token, username, repo, markdownContent, commitMessage = 'docs: update README via README Generator' }) {
  if (!token || !username || !repo) {
    throw new Error('Token, Username, dan Nama Repository wajib diisi!');
  }

  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/README.md`;
  
  // Encode isi Markdown ke Base64 (mendukung karakter UTF-8 / Emoji)
  const encoder = new TextEncoder();
  const data = encoder.encode(markdownContent);
  const base64Content = btoa(String.fromCharCode(...data));

  let sha = null;

  // 1. Cek apakah file README.md sudah ada untuk mendapatkan SHA file lama
  try {
    const getRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (getRes.ok) {
      const existingFileData = await getRes.json();
      sha = existingFileData.sha;
    }
  } catch (err) {
    console.log('File README.md belum ada, akan membuat file baru...');
  }

  // 2. Kirim PUT request untuk Create/Update file README.md
  const bodyData = {
    message: commitMessage,
    content: base64Content,
    ...(sha && { sha }) // Sertakan SHA jika file sudah ada (untuk update)
  };

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyData)
  });

  if (!putRes.ok) {
    const errorData = await putRes.json();
    throw new Error(errorData.message || 'Gagal melakukan commit ke GitHub.');
  }

  return await putRes.json();
}