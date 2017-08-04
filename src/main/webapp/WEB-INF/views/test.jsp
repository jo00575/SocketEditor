<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>${content.title}| Editor</title>
    <link href="/webjars/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/font-awesome.min.css" rel="stylesheet">
    <link href="css/animate.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">  
    <link href="css/prettyPhoto.css" rel="stylesheet">
    <script src="/ckeditor/ckeditor.js"></script>
    <script src="/webjars/jquery/jquery.min.js"></script>
    
    <script src="/js/editor/editor.js"></script>
</head>
<body>
<body>

    <header class="navbar navbar-inverse navbar-fixed-top wet-asphalt" role="banner">
        <div class="container">
            <div class="navbar-header">
                <a class="navbar-brand" href="index.html" style="height: 80px;">Collaborative Editor</a>
            </div>
            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="index.html">List</a></li>
                    <li><a href="about-us.html">New Contents</a></li>
                </ul>
            </div>
        </div>
    </header><!--/header-->

    <section id="title" class="emerald" style="padding: 30px 0;">
        <div class="container">
            <div class="row">
                <div class="col-sm-6">
                    <h3><i class="icon-angle-right"></i>  글 수정</h3>
                    <p>     Connection 버튼을 눌러 편집을 시작합니다.</p>
                </div>
                <div class="col-sm-6">
                    <ul class="breadcrumb pull-right">
                        <li><a href="index.html">/ List /</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </section><!--/#title-->     

    <section id="blog" class="container">
        <div class="row">
            <aside class="col-sm-4 col-sm-push-8">
            	<div class="socket connection">
            		<fieldset class="registration-form" style="width: 225px;">
            			<h5>이름을 입력하세요:</h5>
                		<div class="form-group">
                    		<input type="text" id="username" name="username" placeholder="Username" class="form-control">
                		</div>
                		<div class="form-group">
                    		<button class="btn btn-success btn-md btn-block">Connect</button>
                		</div>
            		</fieldset>
            	</div>
                <div class="widget categories">
                	<fieldset class="registration-form" style="margin-top: 15px; width: 225px;">
                    	<h5>현재 작성자:</h5>
                        <div class="col-sm-12">
                        	<h6><i class="icon-user"></i>  조혜영</h6>
                        	<h6><i class="icon-user"></i>  조혜영</h6>
                        	<h6><i class="icon-user"></i>  조혜영</h6>
                        </div>   
					</fieldset>                  
                </div><!--/.categories-->
            </aside>        
            <div class="col-sm-8 col-sm-pull-4">
                <div class="blog">
                    <div class="blog-item">
                        <div class="blog-content">
                        	<h3>테스트 글의 제목입니다.</h3>
                            <div class="entry-meta">
                                <span><i class="icon-user"></i> 최초 작성자: John</span>
                                <span><i class="icon-calendar"></i> 최근 저장일: Sept 16th, 2012</span>
                            </div>
                            <textarea id="txtEdt"><p>테스트입니다.</p>${content.text }</textarea>
                            	<a class="btn btn-default" style="margin: 15px; float: right;">Save</a>
                            	<a class="btn btn-default" style="margin: 15px; float: right;">Delete</a>
                        </div>
                    </div><!--/.blog-item-->
                </div>
            </div><!--/.col-md-8-->
        </div><!--/.row-->
    </section><!--/#blog-->

    <footer id="footer" class="midnight-blue">
        <div class="container">
            <div class="row">
                <div class="col-sm-6">
                    &copy; 2013 <a target="_blank" href="http://shapebootstrap.net/" title="Free Twitter Bootstrap WordPress Themes and HTML templates">ShapeBootstrap</a>. All Rights Reserved.
                </div>
                <div class="col-sm-6">
                    <ul class="pull-right">
                        <li><a href="index.html">List</a></li>
                    	<li><a href="about-us.html">New Contents</a></li>
                        <li><a id="gototop" class="gototop" href="#"><i class="icon-chevron-up"></i></a></li><!--#gototop-->
                    </ul>
                </div>
            </div>
        </div>
    </footer><!--/#footer-->
</body>
<script>
    CKEDITOR.replace('txtEdt');
</script>
</html>