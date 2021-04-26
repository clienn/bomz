(function($) {
	$.fn.extend({
		puzzle15: function(options) {
			var defaults = {
                dimension: 0,
                cellClass: ''
            };
            
            var options = $.extend(defaults, options);

            var setGrid = () => {
                let grid = [];
                let numbers = Array.from({length: 16}, (v, i) => i);
                numbers.sort(() => Math.random() - 0.5);

                for (let i = 0, idx = 0; i < 4; ++i) {
                    grid[i] = [];
                    for (let j = 0; j < 4; ++j) {
                        grid[i][j] = numbers[idx++];
                    }
                }

                return grid;
            };

            var populate = (obj, grid) => {
                let o = options;

                for (let i = 0; i < 4; ++i) {
                    for (let j = 0; j < 4; ++j) {
                        let val = grid[i][j];
                        let noBorder = '';

                        if (val == 0) {
                            val = '&nbsp;';
                            noBorder = ' no-bg cell-zero';
                        }

                        let cell = `<div class="${o.cellClass}${noBorder}">`
                        cell += `<div>${val}</div>`;
                        cell += '</div>';

                        obj.append(cell);
                    }
                }
            };

            var handleClick = (o, obj, grid) => {
                let cellZero = $('.cell-zero', obj);
                let isAnimating = false;

                $('.' + o.cellClass, obj).click(function() {
                    if (!isAnimating) {
                        let pZero = cellZero.position();
                        let p = $(this).position();

                        let dx = pZero.left - p.left;
                        let dy = pZero.top - p.top;

                        let val = parseInt($('div', this).html());

                        let pos = find(val, grid);
                        let isValid = validateMove(pos);

                        if (isValid) {
                            isAnimating = true;

                            $(this).animate({top: '+=' + dy, left: '+=' + dx}, 50, 'linear', () => {
                                cellZero.animate({top: '+=' + -dy, left: '+=' + -dx}, 50, 'linear', () => {
                                    isAnimating = false;
                                    swap(pos, grid);
                                });
                            });
                        }
                    }
                });
            };

            var find = (n, grid) => {
                let count = 0;
                let pos = [[-1, -1], [-1, -1]];

                for (let i = 0; i < 4; ++i) {
                    for (let j = 0; j < 4; ++j) {
                        if (count < 2) {
                            let val = grid[i][j];

                            if (val == 0 || val == n) {
                                pos[count++] = [j, i];
                            }
                        } else {
                            break;
                        }
                    }
                }

                return pos;
            }

            var swap = (pos, grid) => {
                let x1 = pos[0][0];
                let y1 = pos[0][1];

                let x2 = pos[1][0];
                let y2 = pos[1][1];

                let tmp = grid[y1][x1];
                grid[y1][x1] = grid[y2][x2];
                grid[y2][x2] = tmp;
            }

            var validateMove = (pos) => {
                if (pos[0][0] > -1 && pos[1][0] > -1) {
                    let dx = Math.abs(pos[0][0] - pos[1][0]);
                    let dy = Math.abs(pos[0][1] - pos[1][1]);

                    return ((dx == 1 && dy == 0) || (dy == 1 && dx == 0));
                }

                return false;
            }
			
			return this.each(function() {
				let o = options;
                let obj = $(this);

                let dim = (o.dimension - 8) / 4;
                let fontSize = o.dimension / 140 * 10;

                obj.css({
                    width: o.dimension + 'px',
                    height: o.dimension + 'px',
                });

                let grid = setGrid();
                populate(obj, grid);
                
                $('.' + o.cellClass, obj).css({
                    width: dim + 'px',
                    height: dim + 'px',
                    fontSize: fontSize + 'px'
                });

                handleClick(o, obj, grid);
			});
		}
	});
})(jQuery);
