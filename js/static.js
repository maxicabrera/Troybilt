function getInternetExplorerVersion()
{
  var rv = -1;
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  else if (navigator.appName == 'Netscape')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}

if(getInternetExplorerVersion() > 4)
{
  $("#btn-search").on('click', function() {
    setTimeout(function() {
      $("#txt-search").val($("#txt-search").attr('placeholder'));
    }, 150);
  });

  $('#txt-search').keypress(function() {
    var input = $(this);
    if (input.val() == input.attr('placeholder')) {
      input.val('');
    }
  });
}

$(window).load(function() {
  $('.print-directions').removeClass('print-directions').addClass('print-directions-alt');

  $('body').on('click', '.print-directions-alt', function()
  {
      var printContents = document.getElementById('lwDi').innerHTML;
      var originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
  });

});

/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache (global, factory) {
  if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    global.Mustache = {};
    factory(global.Mustache); // script, wsh, asp
  }
}(this, function mustacheFactory (mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           **/
          while (value != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = hasProperty(value, names[index]);

            value = value[names[index++]];
          }
        } else {
          value = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function render (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '2.2.1';
  mustache.tags = [ '{{', '}}' ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function render (template, view, partials) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

}));

var lang_en =
{
  cart_empty : "Your cart is currently empty.",
  search : "Search",
  search_troy : "Search troybilt.ca",
  search_by_all : "Search <strong>All</strong> for",
  search_by_parts : "Search <strong>Parts</strong> for",
  search_by_equipment : "Search <strong>Equipment</strong> for",
  search_by_article : "Search <strong>Articles</strong> for",
  lawn_care : "Lawn Care",
  gardening : "Gardening",
  walk_behind : "Walk-Behind",
  push : "Push",
  self_propelled : "Self-propelled",
  wide_cut : "Wide Cut",
  riding : "Riding",
  lawn_tractor : "Lawn Tractors",
  zero_turns : "Zero-turns",
  lap_bar : "Lap Bar",
  steering : "Steering Wheel",
  trimmer : "Trimmers & Edgers",
  trimmer_2 : "2-Cycle trimmers",
  trimmer_4 : "4-Cycle trimmers",
  electric_trimmer : "Electric Trimmers",
  trimmer_attach : "Trimmer Attachments",
  attachments : "Attachments",
  power_base : "Power base",
  lawn_edger : "Lawn Edgers",
  garden : "Gardening",
  tiller : "Tillers",
  cultivator : "Cultivators",
  counter_rotating : "Counter Rotating",
  forward_rotating : "Forward Rotating",
  garden_cultivator : "Garden Cultivators",
  chipper : "Chipper Shredders",
  chipper_shredder : "Chipper shredder vacs",
  chipper_upright : "Upright chipper shredders",
  leaf_blower : "Leaf Blowers",
  handheld : "Handheld",
  wheeled : "Wheeled",
  log_splitter : "Log Splitters",
  view_all : "View All",
  power : "Power",
  generator : "Generators",
  pressure_washer : "Pressure washers",
  snow : "Snow",
  snow_thrower : "Snow Throwers",
  snow_single_stage : "Single-stage",
  snow_two_stage : "Two-stage",
  snow_three_stage : "Three-stage",
  tips : "Tips & How-To",
  how_library : "How-To Library",
  clean_up : "Clean Up",
  view_full_library : "View the Full Library",
  seasonal_tip : "Seasonal Tips",
  spring : "Spring",
  summer : "Summer",
  fall : "Fall",
  winter : "Winter",
  dirt_news : "The Dirt eNewsletter",
  sign_up_news : "Sign up for our email newsletter and have timely lawn and garden tips sent to you each month.",
  subscribe : "Subscribe",
  support : "Parts & Support",
  download_manual : "Download a Manual",
  find_manual : "Find Manual",
  need_help_find : "Need help finding your model number?",
  owner_centre : "Owner's Centre",
  my_account : "My Account",
  register_product : "Register a Product",
  register_product_ca : "Product Registration",
  service_locator : "Service Locator",
  sign_in : "Sign In",
  lawn_care_gardening : "Lawn Care & Gardening",
  clean_up_snow : "Clean Up & Snow",
  generator_pressure : "Generators & Pressure Washers",
  where_buy : "Where to Buy",
  troy_product : "Products",
  connect_us : "Connect with Us",
  email_signup : "Email Signup",
  enter_email : "Enter your email address",
  unable_process : "We were unable to process your request. Please try again.",
  continue : "Continue",
  thanks_signin : "Thanks for signing up.",
  please_valid_email : "Please enter a valid email address.",
  view_mobile_site : "View Mobile Site",
  site_lang : "Site/Languages",
  about_troy : "About Troy-Bilt",
  online_policies : "Privacy Policy",
  media_information : "Media Informaiton",
  contact_us : "Contact Us",
  track_order : "Track an Order",
  faq : "FAQs",
  write_review : "Write a Review",
  find_by_part : "Find Parts by Type",
  belts : "Belts",
  blades : "Blades",
  cables : "Cables",
  engine_parts : "Engine Parts & Filters",
  hardware : "Hardware",
  top_selling : "Top-Selling Parts",
  parts_support : "Support",
  recall : "Recalls",
  financing : "Financing",
  your_cart : "Your cart",
  items : "Items",
  french : "French",
  english : "English",
  enter_model_number : "Enter the model number",
  enter_email_address : "Enter email address",
  parts : "Parts",
  parts_copy : "Purchase Troy-Bilt genuine factory parts from your local retailer",
  support_can : "Support",
  walk_behind_can : "Walk-Behind Mowers",
  push_can : "Push Mowers",
  self_propelled_can : "Self-propelled Mowers",
  riding_can : "Riding Mowers",
  zero_turns_can : "Zero-Turn Mowers",
  trimmer_can : "Trimmers, Brush Cutters & Edgers",
  brushcutters_can : "Brushcutters",
  tiller_can : "Garden Tillers",
  counter_rotating_can : "Counter-Rotating Tillers",
  forward_rotating_can : "Forward-Rotating Tillers",
  vertical_tine_can : "Vertical Tine Tiller",
  electric_cultivator_can : "Electric Cultivators",
  two_cycle_can : "2-Cycle Cultivators",
  four_cycle_can : "4-Cycle Cultivators",
  chipper_can : "Chippers",
  chipper_shredder_can : "Chipper Shredder",
  handheld_can : "Handheld Blowers",
  backpack_can : "Backpack Blowers",



}

var lang_fr =
{
  cart_empty : "Your cart is currently empty.",
  search : "Rechercher",
  search_troy : "Rechercher dans troybilt.ca",
  search_by_all : "Rechercher <strong>Tous</strong> pour",
  search_by_part : "Rechercher <strong>Produits</strong> pour",
  search_by_article : "Rechercher <strong>Articles</strong> pour",
  lawn_care : "Entretien de pelouse",
  gardening : "Jardinage",
  walk_behind : "Tondeuses",
  push : "Poussées",
  self_propelled : "Autopropulsées",
  wide_cut : "Grande supérficie",
  riding : "Tracteurs",
  lawn_tractor : "Tracteurs de pelouse",
  zero_turns : "Tondeuses RZT",
  lap_bar : "Barres de conduite",
  steering : "Volant de direction",
  trimmer : "Coupe-herbes et débroussailleuses",
  email_signup : "Inscription du Courriel",
  trimmer_2 : "Coupe-herbes à 2 temps",
  trimmer_4 : "Coupe-herbes à 4 temps",
  electric_trimmer : "Coupe-herbes électriques",
  trimmer_attach : "Accessoires pour coupe-herbes",
  attachments : "Attachments",
  power_base : "Power base",
  lawn_edger : "Débroussailleuses",
  garden : "Jardinage",
  tiller : "Motobineuses",
  cultivator : "Motoculteurs",
  counter_rotating : "Motoculteurs à rotation inversée",
  forward_rotating : "Motoculteurs à rotation avant",
  garden_cultivator : "Garden Cultivators",
  chipper : "Broyeuses - déchiqueteuses",
  chipper_shredder : "Broyeuses-déchiqueteuses",
  chipper_upright : "Broyeuses-déchiqueteuses avec aspirateur",
  leaf_blower : "Souffleurs à feuilles",
  handheld : "Souffleurs portatifs",
  wheeled : "Souffleurs à dos",
  log_splitter : "Fendeuse à bois",
  view_all : "Voir tout",
  power : "Électrique",
  generator : "Generators",
  pressure_washer : "Pressure washers",
  snow : "Déneigement",
  snow_thrower : "Souffleuses à neige",
  snow_single_stage : "Souffleuses à une phase",
  snow_two_stage : "Souffleuses à deux phases",
  snow_three_stage : "Souffleuses à trois phases",
  tips : "Trucs et conseils",
  how_library : "Comment à la bibliothèque",
  clean_up : "Nettoyage",
  view_full_library : "Voir la bibliothèque complète",
  seasonal_tip : "Conseils saisonniers",
  spring : "Printemps",
  summer : "Été",
  fall : "Automne",
  winter : "Hiver",
  dirt_news : "The Dirt eNewsletter",
  sign_up_news : "Sign up for our email newsletter and have timely lawn and garden tips sent to you each month.",
  subscribe : "Subscribe",
  support : "Soutien",
  download_manual : "Télécharger un manuel",
  find_manual : "Trouver un manuel",
  need_help_find : "Besoin d'aide pour trouver votre numéro de modèle?",
  owner_centre : "Centre de propriétaire",
  my_account : "Mon Compte",
  service_locator : "Localisateur de service",
  sign_in : "Entrer",
  register_product : "Enregistrer un produit",
  lawn_care_gardening : "Entretien de pelouse & Jardinage",
  clean_up_snow : "Nettoyage & Neige",
  generator_pressure : "Generators & Pressure Washers",
  where_buy : "Points de vente",
  troy_product : "Produits",
  connect_us : "Suivez nous sur",
  enter_email : "Entrez votre adresse email",
  unable_process : "We were unable to process your request. Please try again.",
  continue : "Continuer",
  thanks_signin : "Merci de vous inscrire.",
  please_valid_email : "S'il vous plaît entrer une adresse email valide.",
  view_mobile_site : "Voir site mobile",
  site_lang : "Site/Langues",
  about_troy : "À propos de nous",
  online_policies : "Politiques en ligne",
  media_information : "Renseignements aux médias",
  contact_us : "Contactez-nous",
  track_order : "Track an Order",
  faq : "FAQs",
  write_review : "Write a Review",
  find_by_part : "Find Parts by Type",
  belts : "Belts",
  blades : "Blades",
  cables : "Cables",
  engine_parts : "Engine Parts & Filters",
  hardware : "Hardware",
  top_selling : "Top-Selling Parts",
  parts_support : "Soutien",
  recall : "Recalls",
  financing : "Financing",
  your_cart : "Your cart",
  items : "Items",
  french : "French",
  english : "English",
  enter_model_number : "Entrer le numéro de modèle",
  enter_email_address : "Entrer votre adresse email",
  parts : "Pièces",
  parts_copy : "Acheter des pièces d'origine Troy-Bilt chez un détaillant près de vous",
  support_can : "Soutien",
  walk_behind_can : "Tondeuses poussées",
  push_can : "Tondeuses",
  self_propelled_can : "Tondeuses automoteurs",
  riding_can : "Tondeuses",
  zero_turns_can : "Zero-Turn Tondeuses",
  trimmer_can : "Trimmers, débroussailleuses et Edgers",
  brushcutters_can : "Débroussailleuses",
  tiller_can : "Jardin Tillers",
  counter_rotating_can : "Tillers de Contre-rotation",
  forward_rotating_can : "Tillers Forward-rotation",
  vertical_tine_can : "Vertical Tine Tiller",
  electric_cultivator_can : "Cultivateurs électriques",
  two_cycle_can : "Cultivateurs 2-cycle",
  four_cycle_can : "Cultivateurs 4-cycle",
  chipper_can : "Déchiqueteuses",
  chipper_shredder_can : "Chipper Shredder",
  handheld_can : "Souffleurs Portatifs",
  backpack_can : "Souffleurs",
};


$(document).ready(function()
{

  $(".iconic").each(function (i, obj) {
    $(obj).prop('src', $(obj).data('fallback'));
    $(obj).css('height', '8px');
    $(obj).css('width', '8px');
    $(obj).css('display', 'inline');
    $(obj).css('margin', '0');
  });

  $('.results').prop('id', 'lwDi');


  $('html').on('click', '.close-reveal-modal', function(e)
  {
        e.preventDefault();

        $('.reveal-modal').foundation('reveal', 'close');

  });

    $('html').on('click', '.reveal-modal-bg', function(e)
  {
        e.preventDefault();

        $('.reveal-modal').foundation('reveal', 'close');

    });

    if($("#lang_fr").length)
    {
    var template = $('#r-gh').html();
    var template2 = $('#r-gf').html();

    template += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script> <script src="https://mtdp.co/wcsstore/Troy/responsive-build/global.min.js"></script>';

    var rendered = Mustache.render(template, lang_en);
    $('#r-gh').html(rendered);

    rendered = Mustache.render(template2, lang_en);
    $('#r-gf').html(rendered);

      $(document).on('click', '#lang_fr', function(e)
      {
        rendered = Mustache.render(template, lang_fr);
        $('#r-gh').html(rendered);
        rendered = Mustache.render(template2, lang_fr);
        $('#r-gf').html(rendered);
        $('.hide_french').hide();
        $(".r-gh .primary-nav .primary").css("padding-left","10px");
        $(".r-gh .primary-nav .primary").css("padding-right","10px");
        if(window.innerWidth < 1860)
          $(".r-gh .primary-nav ul li").css("margin-right","10px");
        //$('.hide_french').hide();
      });

      $(document).on('click', '#lang_en', function(e)
      {
        rendered = Mustache.render(template, lang_en);
        $('#r-gh').html(rendered);
        rendered = Mustache.render(template2, lang_en);
        $('#r-gf').html(rendered);
        $('.hide_french').show();
      });
    }
});


var $window = $(window),
        $w = parseFloat($window.innerWidth()), 
        $body = $('body'),
        $wbody = $body.innerWidth(),
        $globalNav = $('.global-nav'),
        $wHeight = parseFloat($('.r-gh').innerHeight() + $('#tb-content').innerHeight() + $('.r-gf').innerHeight());

    if ($w < 924) {
        $globalNav.css('height', $wHeight);
    }

    $(window).on('resize', function() {
      if ($w < 924) {
          $globalNav.css('height', $wHeight);
      }
    });