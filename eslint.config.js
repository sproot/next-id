module.exports = [
    {
        ignores: [
            '.DS_Store',
            'node_modules/',
            'package-lock.json',
            '.stryker-tmp',
            'reports'
        ],
        languageOptions: {
            ecmaVersion: 11,
            sourceType: 'commonjs',
            globals: {
                expectAsync: true,
                BigInt: true,
                __dirname: true,
                __filename: true,
                exports: true,
                module: true,
                require: true,
                process: true,
                Buffer: true,
                describe: true,
                xdescribe: true,
                it: true,
                xit: true,
                beforeEach: true,
                afterEach: true,
                beforeAll: true,
                afterAll: true,
                expect: true,
                fail: true,
                spyOn: true,
                jasmine: true
            },
            parserOptions: {
                ecmaVersion: 11
            }
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        rules: {
            'indent': ['error', 4, { SwitchCase: 1 }],
            'linebreak-style': ['error', 'unix'],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'eqeqeq': ['error', 'smart'],
            'new-parens': 'error',
            'consistent-return': 'error',
            'no-empty': ['error', { allowEmptyCatch: true }],
            'block-spacing': ['error', 'always'],
            'array-callback-return': ['error'],
            'yoda': ['error', 'never'],
            'prefer-const': 'error',
            'dot-location': ['error', 'property'],
            'eol-last': 'error',
            'no-var': 'error',
            'no-unused-vars': ['error', { args: 'none' }],
            'no-invalid-this': 'error',
            'no-undef-init': 'error',
            'no-lonely-if': 'error',
            'no-extra-bind': 'error',
            'no-extra-label': 'error',
            'no-unneeded-ternary': 'error',
            'no-unused-expressions': ['error', {
                allowShortCircuit: true,
                allowTernary: true
            }],
            'no-useless-concat': 'error',
            'no-useless-return': 'error',
            'no-floating-decimal': 'error',
            'no-implicit-coercion': 'error',
            'no-lone-blocks': 'error',
            'no-trailing-spaces': 'error',
            'no-whitespace-before-property': 'error',
            'no-multi-spaces': ['error', {
                exceptions: {
                    ImportDeclaration: true,
                    VariableDeclarator: true
                }
            }],
            'key-spacing': ['error', {
                beforeColon: false,
                afterColon: true,
                mode: 'minimum'
            }],
            'arrow-spacing': ['error', {
                before: true,
                after: true
            }],
            'arrow-parens': ['error', 'as-needed', {
                requireForBlockBody: true
            }],
            'comma-spacing': ['error', {
                before: false,
                after: true
            }],
            'max-len': ['error', {
                code: 125,
                tabWidth: 4,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreComments: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true
            }]
        }
    }
];
