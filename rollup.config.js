import typescript from "rollup-plugin-typescript2";
import sourceMaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";
import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
    {
        input: "src/Unity/Unity.ts",
        output: [{
            file: "dist/unity/index.mjs",
            format: "es",
            sourcemap: process.argv.indexOf("--mode=production") === -1
        },
        {
            file: "dist/unity/index.cjs",
            format: "cjs",
            sourcemap: process.argv.indexOf("--mode=production") === -1
        }],
        plugins: [
            typescript({ tsconfig: "tsconfig.json" }),
            (process.argv[3] == "production" && terser()) || sourceMaps(),
        ],
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
        ],
    },
    {
        input: "dist/unity/src/Unity/Unity.d.ts",
        output: {
            file: "dist/unity/index.d.ts",
            format: "es",
        },
        plugins: [dts(), {
            name: "udts",
            buildEnd() {
                cleanup("dist/unity/src")
                cleanup("dist/unity/test")
            }
        }],
    },
    {
        input: "src/Unreal/Unreal.ts",
        output: [{
            file: "dist/unreal/index.mjs",
            format: "es",
            sourcemap: process.argv.indexOf("--mode=production") === -1
        },
        {
            file: "dist/unreal/index.cjs",
            format: "cjs",
            sourcemap: process.argv.indexOf("--mode=production") === -1
        }],
        plugins: [
            typescript({ tsconfig: "tsconfig.json" }),
            (process.argv[3] == "production" && terser()) || sourceMaps(),
        ],
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
        ],
    },
    {
        input: "dist/unreal/src/Unreal/Unreal.d.ts",
        output: {
            file: "dist/unreal/index.d.ts",
            format: "es",
        },
        plugins: [dts(), {
            name: "udts",
            buildEnd() {
                cleanup("dist/unreal/src")
                cleanup("dist/unreal/test")
            }
        },

        ],
    },
    {
        input: "test/index.ts",
        output: [{
            file: "dist/test/index.mjs",
            format: "es",
            sourcemap: process.argv.indexOf("--mode=production") === -1
        },
        {
            file: "dist/test/index.cjs",
            format: "cjs",
            sourcemap: process.argv.indexOf("--mode=production") === -1
        }],
        plugins: [
            typescript({ tsconfig: "tsconfig.json" }),
            (process.argv[3] == "production" && terser()) || sourceMaps(),
        ],
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
        ],
    },
    {
        input: "dist/test/test/index.d.ts",
        output: {
            file: "dist/test/index.d.ts",
            format: "es",
        },
        plugins: [dts(), {
            name: "udts",
            buildEnd() {
                cleanup("dist/test/src")
                cleanup("dist/test/test")
            }
        }
        ]
    }
]

function cleanup(dir) {
    const fs = require("fs")
    const path = require("path")
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach((file) => {
            file = path.join(dir, file)
            if (fs.lstatSync(file).isDirectory()) {
                cleanup(file)
            } else {
                fs.unlinkSync(file)
            }
        })
        fs.rmdirSync(dir)
        console.log(`Directory ${dir} has been cleanup.`)
    } else {
        console.warn(`Directory does not exist: ${dir}`)
    }
}
