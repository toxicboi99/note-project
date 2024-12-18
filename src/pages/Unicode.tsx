import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const codeSnippets = [
  {
    title: 'JavaScript Array Methods',
    language: 'javascript',
    code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
const evens = numbers.filter(num => num % 2 === 0);`,
  },
  {
    title: 'Python List Comprehension',
    language: 'python',
    code: `numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]
evens = [x for x in numbers if x % 2 == 0]`,
  },
  {
    title: 'React Hooks Example',
    language: 'jsx',
    code: `function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`,
  },
];

export function Unicode() {
  const { user } = useAuth();
  const [selectedCode, setSelectedCode] = React.useState<string | null>(null);

  const handleCopy = async (code: string) => {
    if (!user) {
      toast.error('Please sign in to copy code');
      return;
    }
    await navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Code Snippets</h1>
      <div className="grid grid-cols-1 gap-6">
        {codeSnippets.map((snippet) => (
          <div key={snippet.title} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{snippet.title}</h3>
            </div>
            <div className="p-4">
              <SyntaxHighlighter
                language={snippet.language}
                style={vscDarkPlus}
                className="rounded-md"
              >
                {snippet.code}
              </SyntaxHighlighter>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleCopy(snippet.code)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </button>
                <button
                  onClick={() => setSelectedCode(snippet.code)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-4xl">
            <SyntaxHighlighter
              language="javascript"
              style={vscDarkPlus}
              className="rounded-md"
            >
              {selectedCode}
            </SyntaxHighlighter>
            <button
              onClick={() => setSelectedCode(null)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}