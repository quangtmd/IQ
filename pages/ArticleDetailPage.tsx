import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_ARTICLES } from '../data/mockData';
import { Article } from '../types';
import Markdown from 'react-markdown'; 

const ArticleDetailPage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const foundArticle = MOCK_ARTICLES.find(a => a.id === articleId);
    setArticle(foundArticle || null);
  }, [articleId]);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold text-textBase">Không tìm thấy bài viết</h2>
        <Link to="/blog" className="text-primary hover:underline mt-4 inline-block">
          Quay lại trang Blog
        </Link>
      </div>
    );
  }

  const placeholderContent = `
Nội dung chi tiết cho bài viết "${article.title}".

## Đây là một tiêu đề phụ

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

*   Mục 1
*   Mục 2
*   Mục 3

### Tiêu đề nhỏ hơn

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet('World');
\`\`\`

Hình ảnh minh họa (nếu có):

![Placeholder Image](https://picsum.photos/seed/${article.id}D/800/400)

Kết luận, ${article.summary.toLowerCase()}
  `;


  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="bg-bgBase p-6 md:p-10 rounded-lg shadow-xl border border-borderDefault">
        <header className="mb-8">
          <p className="text-primary font-semibold mb-2">{article.category}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-textBase mb-3">{article.title}</h1>
          <div className="text-sm text-textMuted">
            <span>Đăng bởi: {article.author}</span> | <span>Ngày: {article.date}</span>
          </div>
        </header>
        
        <img 
            src={article.imageUrl || `https://picsum.photos/seed/${article.id}/800/400`} 
            alt={article.title}
            className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-8 shadow border border-borderDefault"
        />

        {/* Adjusted prose for light theme */}
        <div className="prose prose-lg max-w-none text-textBase 
                        prose-headings:text-textBase prose-a:text-primary hover:prose-a:underline 
                        prose-strong:text-textBase prose-blockquote:border-primary 
                        prose-blockquote:text-textMuted prose-code:text-secondary-dark 
                        prose-code:bg-bgMuted prose-code:p-1 prose-code:rounded prose-img:rounded-md
                        prose-li:marker:text-textMuted">
          <Markdown>{article.content || placeholderContent}</Markdown>
        </div>

        <div className="mt-10 pt-6 border-t border-borderDefault">
            <Link to="/blog" className="text-primary hover:text-primary-dark font-semibold">
                <i className="fas fa-arrow-left mr-2"></i> Quay lại Blog
            </Link>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;