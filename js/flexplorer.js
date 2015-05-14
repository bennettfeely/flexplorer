    $(function() {
        var demo = $("#demo");
        var demo_styles = $("#demo_styles");
        var flex_items = $("#demo .flex-item");

        // Calculate and apply incremental hsl colors to the flex-items
        var pallete = Math.floor(Math.random() * 360) + 100; // To make life easier later and always have a 3 digit number
        $('.flex-item').each(function(i) {
            var hue = pallete + (i * 5);
            var background_color = 'background:hsl(' + hue + ',50%,75%)';
            $(this).attr("style", background_color);
        });


        $(window).load(function() {

            var c = $(".flex-item").length;
            // Items own properties (starting at 1)
            var items = [];
            var selected_item = false;
            
            flex_properties = '\t-webkit-flex-flow: row wrap;\n'
                    + '\t-moz-flex-flow: row wrap;\n'
                    + '\tflex-flow: row wrap;\n';

            justify_content = '';
            align_items = '';
            align_content = '';

            flex = '\t-webkit-flex: 1 auto;\n'
                + '\t-moz-flex: 1 auto;\n'
                + '\tflex: 1 auto;\n';


            function updateResult() {
                var flex_container_code = '.flex-container {\n'
                    + '\tdisplay: -webkit-flex;\n'
                    + '\tdisplay: -moz-flex;\n'
                    + '\tdisplay: flex;\n'
                    + flex_properties
                    + justify_content
                    + align_items
                    + align_content
                    + '}\n';
                var flex_item_code = '.flex-item {\n'
                    + flex
                    + '\talign-self: auto;\n'
                    + '}';
                
                var flex_items_code = '\n';
                for(var i=1;i<=c;++i) {
                    if(items[i]) {
                        var i_flex_item_code = '';
                        if(items[i].grow) i_flex_item_code += 'flex-grow: ' + items[i].grow + ';';
                        if(items[i].shrink) i_flex_item_code += 'flex-shrink: ' + items[i].shrink + ';';
                        if(items[i].basis) i_flex_item_code += 'flex-basis: ' + items[i].basis + ';';
                        if(items[i].align) i_flex_item_code += 'align-self: ' + items[i].align + ';';
                        if(items[i].order) i_flex_item_code += 'order: ' + items[i].order + ';';
                        if(i_flex_item_code) {
                            flex_items_code += '#item-'+i+' { ' + i_flex_item_code + ' }\n';
                        }
                    }
                }

                var style = flex_container_code + '\n' +  flex_item_code + '\n' + flex_items_code;

                $("#demo_styles").html(style);

            }
            
            function updateCounter() {
                $('#count').val(c);
            }

            // Append brand new .flex-item, countinuing background-color
            var text_array = ["banana", "lorem", "culpa", "anim", "mollit", "id", "est", "laborum"];
            function countIncrease() {
                if(c < 999) {
                    c++;
                    items[c] = {};
                    var flex_item_text = text_array[c%text_array.length];
                    var last_attr_style = $("#demo .flex-item").last().attr("style");
                    var base = last_attr_style.substring(15, 18);
                    var hue = parseInt(base) + 5;
                    var new_flex_item = '<div id="item-' + c + '" style="background:hsl(' + hue + ',50%,75%);" class="flex-item"><span contenteditable="true">' + flex_item_text + '</span></div>';

                    demo.append(new_flex_item);
                    return true;
                }
                return false;
            }
            // Remove last .flex-item
            function countDecrease() {
                if(c > 1) {
                    items[c] = {};
                    c--;
                    $("#demo .flex-item").last().remove();
                    return true;
                }
                return false;
            }
            
            function itemSelect(index) {
                if(selected_item) itemDeselect();
                $('#selected-index').text(index);
                selected_item = index;
                $('#item-'+selected_item).addClass('selected');
                
                if(!items[index]) return;
                
                if(items[index].grow) $('#item-flex-grow-control').val(items[index].grow);
                if(items[index].shrink) $('#item-flex-shrink-control').val(items[index].shrink);
                if(items[index].basis) $('#item-flex-basis-control').val(items[index].basis);
                if(items[index].order) $('#item-order-control').val(items[index].order);
                if(items[index].align) $('#item-align-self-control').val(items[index].align);
            }
            function itemDeselect() {
                $('.flex-item.selected').removeClass('selected');
                $('.selected-item-field').val('');
                $('#selected-index').text('_');
            }


            // Leggo
            $("body").addClass("go");

            // Toggle sidebar controls
            $("#toggle-controls").click(function() {
                $("#sidebar").toggleClass("minimized");
            });


            // Flex property controls
            $('#flex-grow-control, #flex-shrink-control, #flex-basis-control').blur(function() {
                var flex_grow_val = $('#flex-grow-control').val();
                var flex_shrink_val = $('#flex-shrink-control').val();
                var flex_basis_val = $('#flex-basis-control').val();

                var flex_val = flex_grow_val + ' ' + flex_shrink_val + ' ' + flex_basis_val;
                    if(flex_val == "0 1 auto"){ flex_val = "initial"; }
                    if(flex_val == "1 1 auto"){ flex_val = "auto"; }
                    if(flex_val == "0 0 auto"){ flex_val = "none"; }


                flex = '\t-webkit-flex: ' + flex_val + ';\n'
                + '\t-moz-flex: ' + flex_val + ';\n'
                + '\tflex: ' + flex_val + ';\n'

                updateResult();
            });


            // Sidebar property controls
            $('#flex-direction-control, #flex-wrap-control').change(function() {
                var flex_direction_val = $('#flex-direction-control :selected').val();
                var flex_wrap_val = $('#flex-wrap-control :selected').val();

                flex_properties = '\t-webkit-flex-flow: ' + flex_direction_val + ' ' + flex_wrap_val + ';\n'
                    + '\t-moz-flex-flow: ' + flex_direction_val + ' ' + flex_wrap_val + ';\n'
                    + '\tflex-flow: ' + flex_direction_val + ' ' + flex_wrap_val + ';\n';

                updateResult();
            });



            // justify-content property controls
            $('#justify-content-control').change(function() {
                var justify_content_val = $('#justify-content-control :selected').val();
                    if (justify_content_val == "flex-start") { justify_content = ''; }

                justify_content = '\t-webkit-justify-content: ' + justify_content_val + ';\n'
                    + '\t-moz-justify-content: ' + justify_content_val + ';\n'
                    + '\tjustify-content:' + justify_content_val + ';\n';

                if (justify_content_val == "flex-start") { justify_content = ''; }

                updateResult();
            });

            $('#align-items-control').change(function() {
                align_items_val = $('#align-items-control :selected').val();
                    if (align_items_val == "stretch") { align_items = ''; }

                align_items = '\t-webkit-align-items: ' + align_items_val + ';\n'
                    + '\talign-items:' + align_items_val + ';\n';

                if (align_items_val == "stretch") { align_items = ''; }

                updateResult();
            });

            $('#align-content-control').change(function() {
                align_content_val = $('#align-content-control :selected').val();
                    if (align_content_val == "stretch") { align_content = ''; }

                align_content = '\t-webkit-align-content: ' + align_content_val + ';\n'
                    + '\talign-content:' + align_content_val + ';\n';

                if (align_content_val == "stretch") { align_content = ''; }

                updateResult();
            });

            // Count increase button
            $("#count-increase").click(function() {
                if(countIncrease()) {
                    updateResult();
                    updateCounter();
                }
            });


            // Count decrease button
            $("#count-decrease").click(function() {
                if(countDecrease()) {
                    updateResult();
                    updateCounter();
                }
            });


            // Count field
            $("#count").change(function() {
                var count = parseInt(this.value);
                if(count < c) {
                    for(var i=c;i>count;--i) {
                        countDecrease();
                    }
                }
                else if(count > c) {
                    for(var i=c;i<count;++i) {
                        countIncrease();
                    }
                }
                
                updateResult();
                updateCounter();
            });
            
            // Item selection
            $('#demo').on('click', '.flex-item',function() {
               itemSelect(parseInt(this.id.replace(/[^0-9]+/,''))); 
            });
            
            // Item properties
            $('.selected-item-field').change(function() {
                if(!selected_item) return;
                if(!items[selected_item]) items[selected_item] = {};
                
                var $this = $(this);
                
                items[selected_item][$this.data('prop')] = $this.val();
                updateResult();
            });
            
            updateResult();
            updateCounter();
        });
    });
