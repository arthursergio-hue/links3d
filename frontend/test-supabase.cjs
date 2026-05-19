// Script para testar Supabase - busca de imagens de cobertura
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://api-spotsys.seazone.com.br';
const supabaseKey = 'szi_key_FrjkbE_DXrKjA7rNlEpDQtcJ0hcAPm9pNsreuYobdQk';

const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    headers: {
      'X-SZI-API-KEY': supabaseKey
    }
  }
});

async function testSupabaseImages() {
  console.log('=== Testando Supabase - Imagens de Cobertura ===\n');

  // 1. Listar buckets de storage
  console.log('1. Listando Buckets...');
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

  if (bucketError) {
    console.log('   Erro ao listar buckets:', bucketError.message);
  } else {
    console.log(`   Buckets encontrados: ${buckets?.length || 0}`);
    buckets?.forEach(b => console.log(`   - ${b.name} (público: ${b.public})`));
  }

  // 2. Listar arquivos de cada bucket
  console.log('\n2. Listando arquivos em cada bucket...');

  const bucketsToCheck = ['galeria', 'fachada', 'imagens', 'imagens_externas', 'upload', 'thumbnails'];

  for (const bucketName of bucketsToCheck) {
    try {
      const { data, error } = await supabase.storage.from(bucketName).list('', { limit: 20 });

      if (error) {
        console.log(`   ${bucketName}: Erro - ${error.message}`);
      } else if (!data || data.length === 0) {
        console.log(`   ${bucketName}: Vazio`);
      } else {
        console.log(`\n   Bucket "${bucketName}" - ${data.length} arquivos:`);

        const images = data.filter(f => {
          const ext = f.name?.toLowerCase();
          return ext?.endsWith('.jpg') || ext?.endsWith('.jpeg') || ext?.endsWith('.png') ||
                 ext?.endsWith('.gif') || ext?.endsWith('.webp') || f.metadata?.contentType?.startsWith('image/');
        });

        images.slice(0, 5).forEach(f => {
          const url = supabase.storage.from(bucketName).getPublicUrl(f.name);
          console.log(`     - ${f.name}`);
          console.log(`       URL: ${url.publicUrl}`);
        });

        if (images.length > 5) {
          console.log(`     ... e mais ${images.length - 5} imagens`);
        }
      }
    } catch (e) {
      console.log(`   ${bucketName}: Erro - ${e.message}`);
    }
  }

  // 3. Verificar tabela de empreendimentos
  console.log('\n3. Verificando tabela de empreendimentos...');

  try {
    const { data, error } = await supabase.from('empreendimentos').select('*').limit(3);

    if (error) {
      console.log('   Erro:', error.message);
    } else if (!data || data.length === 0) {
      console.log('   Nenhum empreendimento encontrado');
    } else {
      console.log(`   Encontrados ${data.length} empreendimentos`);
      data.forEach(emp => {
        console.log(`   - ${emp.nome || emp.name || emp.id}`);
        if (emp.thumbnailUrl) {
          console.log(`     Thumbnail: ${emp.thumbnailUrl}`);
        }
      });
    }
  } catch (e) {
    console.log('   Erro ao buscar empreendimentos:', e.message);
  }

  console.log('\n=== Teste concluído ===');
}

testSupabaseImages().catch(console.error);