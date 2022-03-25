export default class Alphabet {
    static font = "monospace";
    static fontSize = "16px";
    static letterSpacing = 1;

    static A(ctx, x, y, offset) {
        ctx.moveTo((x - parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize));
        ctx.lineTo(x + offset, y - parseInt(this.fontSize) / 2);
        ctx.lineTo((x + parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize));
        ctx.moveTo((x - parseInt(this.fontSize) / 4) + offset, y + parseInt(this.fontSize) / 2.5);
        ctx.lineTo((x + parseInt(this.fontSize) / 4) + offset, y + parseInt(this.fontSize) / 2.5);
    }

    static a(ctx, x, y, offset) {
        ctx.moveTo((x - parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize) / 4);
        ctx.bezierCurveTo((x - parseInt(this.fontSize) / 3) + offset, y + parseInt(this.fontSize) / 6, (x + parseInt(this.fontSize) / 3) + offset, y + parseInt(this.fontSize) / 6, (x + parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize) / 3);
        ctx.lineTo((x + parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize));
        ctx.moveTo((x + parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize) / 2);
        ctx.quadraticCurveTo((x - parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize) / 3, (x - parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize) / 1.4);
        ctx.quadraticCurveTo((x - parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize), (x + parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize) / 1.2);
    }

    static B(ctx, x, y, offset) {
        ctx.moveTo((x - parseInt(this.fontSize) / 2) + offset, y - parseInt(this.fontSize) / 2);
        ctx.lineTo((x - parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize));
        ctx.lineTo(x + offset, y + parseInt(this.fontSize));
        ctx.quadraticCurveTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 1.5, x + offset, y + parseInt(this.fontSize) / 4);
        ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 4);
        ctx.moveTo(x + offset, y + parseInt(this.fontSize) / 4);
        ctx.quadraticCurveTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize) / 4, x + offset, y - parseInt(this.fontSize) / 2);
        ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize) / 2);
    }

    static b(ctx, x, y, offset) {
        ctx.moveTo((x - parseInt(this.fontSize) / 2) + offset, y - parseInt(this.fontSize) / 2);
        ctx.lineTo((x - parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize));
        ctx.moveTo((x - parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize));
        ctx.lineTo(x + offset, y + parseInt(this.fontSize));
        ctx.quadraticCurveTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 1.5, x + offset, y + parseInt(this.fontSize) / 4);
        ctx.quadraticCurveTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 5, x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 3);
    }

    static C(ctx, x, y, offset) {
        ctx.moveTo((x + parseInt(this.fontSize) / 2) + offset, y - parseInt(this.fontSize) / 3);
        ctx.bezierCurveTo(
            x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize),
            x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) * 1.4,
            x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 1.4
        );
    }

    static c(ctx, x, y, offset) {
        ctx.moveTo((x + parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize) / 4);
        ctx.bezierCurveTo(
            x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 5,
            x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize),
            x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize)
        );
    }

    static D(ctx, x, y, offset) {
        ctx.moveTo((x - parseInt(this.fontSize) / 2) + offset, y - parseInt(this.fontSize) / 2);
        ctx.lineTo((x - parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize));
        ctx.bezierCurveTo(
            x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize),
            x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize) / 2,
            x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize) / 2
        );
    }

    static d(ctx, x, y, offset) {
        ctx.moveTo((x + parseInt(this.fontSize) / 2) + offset, y - parseInt(this.fontSize) / 2);
        ctx.lineTo((x + parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize));
        ctx.moveTo((x + parseInt(this.fontSize) / 2) + offset, y + parseInt(this.fontSize));
        ctx.lineTo(x + offset, y + parseInt(this.fontSize));
        ctx.quadraticCurveTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 1.5, x + offset, y + parseInt(this.fontSize) / 4);
        ctx.quadraticCurveTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 5, x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 3);
    }
}