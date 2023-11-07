hexo.extend.tag.register('wrong', function(args, content){
    var className =  args.join(' ');
    var formattedContent = content.replace(/\n/g, '<br>');  // 将换行符替换为 <br> 标签
    return '<div class="uk-alert uk-alert-danger"><i class="fas fa-exclamation-triangle"></i> ' + formattedContent + '</div>';
  }, {ends: true});
  
  hexo.extend.tag.register('right', function(args, content){
    var className =  args.join(' ');
    var formattedContent = content.replace(/\n/g, '<br>');  // 将换行符替换为 <br> 标签
    return '<div class="uk-alert uk-alert-success"><i class="fa fa-check-circle"></i> ' + formattedContent + '</div>';
  }, {ends: true});
  
  hexo.extend.tag.register('warning', function(args, content){
    var className =  args.join(' ');
    var formattedContent = content.replace(/\n/g, '<br>');  // 将换行符替换为 <br> 标签
    return '<div class="uk-alert uk-alert-warning"><i class="fa fa-exclamation-circle"></i> ' + formattedContent + '</div>';
  }, {ends: true});

  hexo.extend.tag.register('list', function(args, content){
    var className =  args.join(' ');
    var formattedContent = content.replace(/\n/g, '<br>');  // 将换行符替换为 <br> 标签
    return '<div class="uk-alert uk-alert-list"><i class="fas fa-list-ul"></i> ' +formattedContent + '</div>';
  }, {ends: true});
  